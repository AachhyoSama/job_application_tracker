import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET =
    process.env.JWT_SECRET ||
    "021ab7409f5034531520121847082e9ec90c8d44590be289604ecd9a975108d7";

export const JWT_EXPIRES_IN = "1h";
