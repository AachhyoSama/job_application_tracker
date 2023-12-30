// authUtil.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.config.js";

export const generateToken = (user) => {
    const payload = {
        userId: user.userId,
        email: user.email,
    };

    const options = {
        expiresIn: "1h", // Token expiration time
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
};

export const extractUserFromToken = (token) => {
    const decoded = verifyToken(token);

    if (decoded) {
        const { userId, email } = decoded;
        return { userId, email };
    }

    return null;
};
