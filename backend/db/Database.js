import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        console.log("DB_URL:", process.env.DB_URL);

        const data = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};
