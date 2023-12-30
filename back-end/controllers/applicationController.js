import express from "express";
import { ObjectId } from "mongodb";
import { ApplicationModel } from "../models/applicationModel.js";
import { JobModel } from "../models/jobModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const applicationController = express.Router();
const applicationModel = new ApplicationModel();
const jobModel = new JobModel();

// Connect to the database
applicationModel.connect();
jobModel.connect();

// Get all applications for the logged-in user
applicationController.get("/", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId; // Get the user ID from the authenticated user

        const applications = await applicationModel.getAllApplications(userId);
        res.status(200).json({
            success: true,
            message: "User's Applications List!",
            data: applications,
        });
    } catch (error) {
        console.error("Error getting user's applications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create an application for the logged-in user
applicationController.post("/", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.userId; // Get the user ID from the authenticated user
        const { applicationData, jobId } = req.body;

        // Check if the job with the given ID exists
        const jobExists = await jobModel.getSingleJob(jobId);
        if (!jobExists) {
            return res.status(404).json({ error: "Job not found!!" });
        }

        // Add the jobId and userId to the applicationData
        applicationData.jobId = new ObjectId(jobId);
        applicationData.userId = new ObjectId(userId);

        const newApplication = await applicationModel.createApplication(
            userId,
            applicationData
        );

        res.status(201).json({
            success: true,
            message: "Application created successfully!",
            data: newApplication,
        });
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get a specific application for the logged-in user
applicationController.get("/:id", authenticateUser, async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await applicationModel.getSingleApplication(
            applicationId
        );

        if (!application) {
            return res.status(404).json({ error: "Application not found!!" });
        }

        res.status(200).json({
            success: true,
            message: "Application retrieved successfully!",
            data: application,
        });
    } catch (error) {
        console.error("Error getting application by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a specific application for the logged-in user
applicationController.put("/:id", authenticateUser, async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { applicationData, jobId } = req.body;

        // Check if the job with the given ID exists
        const jobExists = await jobModel.getSingleJob(jobId);
        if (!jobExists) {
            return res.status(404).json({ error: "Job not found!!" });
        }

        // Add the jobId to the applicationData
        applicationData.jobId = new ObjectId(jobId);

        const result = await applicationModel.updateApplication(
            applicationId,
            applicationData
        );

        if (!result.success) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({
            success: true,
            message: "Application updated successfully!",
            data: result,
        });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a specific application for the logged-in user
applicationController.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const applicationId = req.params.id;
        const result = await applicationModel.deleteApplication(applicationId);

        if (!result.success) {
            return res.status(404).json({ error: "Application not found!!" });
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default applicationController;
