import express from "express";
import authController from "../controllers/authController.js";

export const authRoutes = express.Router();

authRoutes.post("/register", authController);
authRoutes.post("/login", authController);
