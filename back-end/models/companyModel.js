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

    validateCompanyData = async (companyData) => {
        await this.db.command({
            collMod: "company",
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "location",
                        "website",
                        "phone",
                        "email",
                        "description",
                        "industry",
                    ],
                    properties: {
                        name: {
                            bsonType: "string",
                            description:
                                "'name' must be a string and is required",
                        },
                        location: {
                            bsonType: "object",
                            required: ["address1", "city", "state", "zip"],
                            properties: {
                                address1: {
                                    bsonType: "string",
                                    description:
                                        "'Address 2' has to be string and is required",
                                },
                                address2: {
                                    bsonType: "string",
                                    description: "'Address 1' has to be string",
                                },
                                city: {
                                    bsonType: "string",
                                    description:
                                        "'City' has to be string and is required",
                                },
                                state: {
                                    bsonType: "string",
                                    description:
                                        "'State' has to be string and is required",
                                },
                                zip: {
                                    bsonType: "string",
                                    description:
                                        "'Zip' has to be string and is required",
                                },
                            },
                        },
                        website: {
                            bsonType: "string",
                            description:
                                "'website' must be a string and is required",
                        },
                        phone: {
                            bsonType: "string",
                            description:
                                "'phone' must be a string and is required",
                        },
                        email: {
                            bsonType: "string",
                            description:
                                "'email' must be a string and is required",
                        },
                        description: {
                            bsonType: "string",
                            description:
                                "'Description' must be a string and is required",
                        },
                        industry: {
                            bsonType: "array",
                            description:
                                "'Industry' must be a string and is required",
                        },
                    },
                },
            },
            validationLevel: "strict",
        });
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
            // Validate the company data before adding it to the database
            this.validateCompanyData(companyData);

            const newCompany = await this.db
                .collection("company")
                .insertOne(companyData);

            return newCompany;
        } catch (error) {
            console.error("Error creating company:", error);
            throw error;
        }
    };

    updateCompany = async (companyId, updatedCompanyData) => {
        try {
            // Validate the company data before adding it to the database
            this.validateCompanyData(updatedCompanyData);

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
