import { MongoClient, ObjectId } from "mongodb";
import { DATABASE_CONFIG } from "../config/database.config.js";

export class CompanyModel {
    constructor() {
        this.client = new MongoClient(DATABASE_CONFIG.DATABASE_URL);
        this.db = null;
    }

    connect = async () => {
        try {
            await this.client.connect();
            this.db = this.client.db(DATABASE_CONFIG.DATABASE_NAME);
        } catch (error) {
            console.error("Error connecting to the database:", error);
            throw error;
        }
    };

    disconnect = async () => {
        try {
            await this.client.close();
        } catch (error) {
            console.error("Error disconnecting from the database:", error);
            throw error;
        }
    };

    getAllCompanies = async () => {
        try {
            const companies = await this.db
                .collection("company")
                .find()
                .sort({ _id: -1 })
                .toArray();
            return companies;
        } catch (error) {
            console.error("Error getting all companies:", error);
            throw error;
        }
    };

    createCompany = async (companyData) => {
        try {
            const newCompany = await this.db
                .collection("company")
                .insertOne(companyData);
            return newCompany;
        } catch (error) {
            console.error("Error getting all companies:", error);
            throw error;
        }
    };

    updateCompany = async (companyId, updatedCompanyData) => {
        try {
            const result = await this.db
                .collection("company")
                .updateOne(
                    { _id: new ObjectId(companyId) },
                    { $set: updatedCompanyData }
                );

            if (result.matchedCount === 0) {
                throw new Error("Company not found!!");
            }

            const updatedCompany = await this.getSingleCompany(companyId);
            return { success: true, updatedCompany };
        } catch (error) {
            console.error("Error updating company:", error);
            throw error.message;
        }
    };

    getSingleCompany = async (companyId) => {
        try {
            const company = await this.db
                .collection("company")
                .findOne({ _id: new ObjectId(companyId) });

            return company;
        } catch (error) {
            console.error("Error getting company by ID:", error);
            throw error.message;
        }
    };

    deleteCompany = async (companyId) => {
        try {
            const deletedCompany = await this.db
                .collection("company")
                .deleteOne({ _id: new ObjectId(companyId) });

            if (deletedCompany.deletedCount === 0) {
                throw new Error("Company not found!!");
            }

            return { success: true, message: "Company deleted successfully!!" };
        } catch (error) {
            console.error("Error deleting the company:", error);
            throw error.message;
        }
    };
}
