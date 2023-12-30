import crypto from "crypto";

const secretKey = crypto.randomBytes(16).toString("hex");

export const JWT_SECRET = secretKey;
