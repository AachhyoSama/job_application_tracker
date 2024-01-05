import express from "express";
import { ObjectId } from "mongodb";
import { JobModel } from "../models/jobModel.js";
import { CompanyModel } from "../models/companyModel.js";

const jobController = express.Router();
const jobModel = new JobModel();
const companyModel = new CompanyModel();

// Connect to the database
jobModel.connect();
companyModel.connect();

// Get all jobs
jobController.get("/", async (req, res) => {
    try {
        const jobs = await jobModel.getAllJobs();
        res.status(200).json({
            success: true,
            message: "Jobs List!",
            data: jobs,
        });
    } catch (error) {
        console.error("Error getting all jobs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a Job
jobController.post("/", async (req, res) => {
    try {
        const { job_data, company_id } = req.body;

        // Check if the company with the given ID exists
        const companyExists = await companyModel.getSingleCompany(company_id);
        if (!companyExists) {
            return res.status(404).json({ error: "Company not found!!" });
        }

        // Add the company_id to the job_data
        job_data.company_id = new ObjectId(company_id);

        const newJob = await jobModel.createJob(job_data);
        res.status(201).json({
            success: true,
            message: "Job created successfully!",
            data: newJob,
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ success: false, error });
    }
});

// Get a job by ID
jobController.get("/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobModel.getSingleJob(jobId);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json({
            success: true,
            message: "Job retrieved successfully!",
            data: job,
        });
    } catch (error) {
        console.error("Error getting job by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a job by ID
jobController.put("/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        const { job_data, company_id } = req.body;

        // Check if the company with the given ID exists
        const companyExists = await companyModel.getSingleCompany(company_id);
        if (!companyExists) {
            return res.status(404).json({ error: "Company not found!!" });
        }

        // Add the company_id to the job_data
        job_data.company_id = new ObjectId(company_id);

        const result = await jobModel.updateJob(jobId, job_data);

        if (!result.success) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully!",
            data: result,
        });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ success: false, error });
    }
});

// Delete a job by ID from parameter
jobController.delete("/:id", async (req, res) => {
    try {
        const jobId = req.params.id;
        const result = await jobModel.deleteJob(jobId);

        if (!result.success) {
            return res.status(404).json({ error: "Job not found!!" });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default jobController;
