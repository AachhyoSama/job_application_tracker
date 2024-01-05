import express from "express";
import { CompanyModel } from "../models/companyModel.js";

const companyController = express.Router();
const companyModel = new CompanyModel();

// Connect to the database
companyModel.connect();

// Get all companies
companyController.get("/", async (req, res) => {
    try {
        const companies = await companyModel.getAllCompanies();
        res.status(200).json({
            success: true,
            message: "Companies List!",
            data: companies,
        });
    } catch (error) {
        console.error("Error getting all companies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a company
companyController.post("/", async (req, res) => {
    try {
        const companyData = req.body;
        const newCompany = await companyModel.createCompany(companyData);
        res.status(201).json({
            success: true,
            message: "Company created successfully!",
            data: newCompany,
        });
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ sucess: false, error });
    }
});

// Get a company by ID
companyController.get("/:id", async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await companyModel.getSingleCompany(companyId);

        if (!company) {
            return res
                .status(404)
                .json({ success: false, error: company.error });
        }

        res.status(200).json({
            success: true,
            message: "Company retrieved successfully!",
            data: company,
        });
    } catch (error) {
        console.error("Error getting company by ID:", error);
        res.status(500).json({ success: false, error });
    }
});

// Update a company by ID
companyController.put("/:id", async (req, res) => {
    try {
        const companyId = req.params.id;
        const updatedCompanyData = req.body;
        const result = await companyModel.updateCompany(
            companyId,
            updatedCompanyData
        );

        if (!result.success) {
            return res
                .status(404)
                .json({ success: false, error: result.error });
        }

        res.status(200).json({
            success: true,
            message: "Company updated successfully!",
            data: result.updatedCompany,
        });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({
            success: false,
            error,
        });
    }
});

// Delete a company by ID from parameter
companyController.delete("/:id", async (req, res) => {
    try {
        const companyId = req.params.id;
        const result = await companyModel.deleteCompany(companyId);

        if (!result.success) {
            return res
                .status(404)
                .json({ success: false, error: result.error });
        }

        res.status(200).json({
            success: true,
            message: "Company deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ success: false, error });
    }
});

export default companyController;
