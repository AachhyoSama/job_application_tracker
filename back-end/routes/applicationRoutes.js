import express from "express";
import applicationController from "../controllers/applicationController.js";

export const applicationRoutes = express.Router();

applicationRoutes.all("/:id?", applicationController);
