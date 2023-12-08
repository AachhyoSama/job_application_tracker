import express from "express";
import companyController from "../controllers/companyController.js";

export const companyRoutes = express.Router();

// Access company routes
companyRoutes.all("/:id?", companyController);
