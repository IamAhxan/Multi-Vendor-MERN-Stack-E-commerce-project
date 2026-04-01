import dotenv from "dotenv";
import app from "../backend/App.js";
import { connectDatabase } from "../backend/db/Database.js";
dotenv.config();
connectDatabase();

export default app;