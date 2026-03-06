import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'config', '.env') });

import app from "./App.js";
import { connectDatabase } from "./db/Database.js";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});

// Connect DB
connectDatabase();

// Start server
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
