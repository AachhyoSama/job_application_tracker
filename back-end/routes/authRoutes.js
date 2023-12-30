// authRoutes.js
import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import authController from "../controllers/authController.js";

export const authRoutes = express.Router();

// Register a new user
authRoutes.post("/register", authController);

// Login a user
authRoutes.post("/login", authController);

// Logout a user
authRoutes.post("/logout", authenticateUser, authController);
