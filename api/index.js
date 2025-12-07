"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure MongoDB connects only once per cold start
if (mongoose_1.default.connection.readyState === 0) {
    mongoose_1.default.connect(process.env.MONGODB_URI_STRING)
        .then(() => console.log("✅ MongoDB connected (Vercel)"))
        .catch((err) => console.error("❌ MongoDB connection failed:", err));
}
exports.default = app_1.default;
