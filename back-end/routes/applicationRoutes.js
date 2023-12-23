import express from "express";
import applicationController from "../controllers/applicationController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

export const applicationRoutes = express.Router();

// Apply the authenticateUser middleware to all routes in applicationRoutes
applicationRoutes.use(authenticateUser);

applicationRoutes.all("/:id?", applicationController);
