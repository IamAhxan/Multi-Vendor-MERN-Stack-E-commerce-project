import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import app from "./App.js";
import { connectDatabase } from "./db/Database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only load dotenv in development. In Vercel, use the Dashboard UI.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: join(__dirname, 'config', '.env') });
}

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    if (process.env.NODE_ENV !== 'production') process.exit(1);
});

// Connect DB
connectDatabase();

// Only start the server listener if NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    });

    // Handle unhandled rejections
    process.on("unhandledRejection", (err) => {
        console.error(`Error: ${err.message}`);
        server.close(() => process.exit(1));
    });
}

// IMPORTANT FOR VERCEL
export default app;