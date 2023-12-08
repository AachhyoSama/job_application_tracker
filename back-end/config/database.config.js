import dotenv from "dotenv";

dotenv.config();

export const DATABASE_CONFIG = {
    // MongoDB connection settings
    DATABASE_URL:
        process.env.MONGODB_URL ||
        "mongodb://localhost:27017/your-database-name",
    DATABASE_NAME: process.env.DATABASE_NAME || "test-database",
};
