import app from "../src/app/app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Ensure MongoDB connects only once per cold start
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI_STRING!)
    .then(() => console.log("✅ MongoDB connected (Vercel)"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err));
}

export default app;
