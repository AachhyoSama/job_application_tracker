import express from "express";
import jobController from "../controllers/jobController.js";

export const jobRoutes = express.Router();

jobRoutes.all("/:id?", jobController);
