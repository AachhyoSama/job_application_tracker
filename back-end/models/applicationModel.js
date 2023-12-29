import { MongoClient, ObjectId } from "mongodb";
import { DATABASE_CONFIG } from "../config/database.config.js";

export class ApplicationModel {
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
            console.log("Disconnected from the database!!");
        } catch (error) {
            console.error("Error disconnecting from the database:", error);
            throw error;
        }
    };

    getAllApplications = async () => {
        try {
            const applications = await this.db
                .collection("applications")
                .aggregate([
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "jobId",
                            foreignField: "_id",
                            as: "job",
                        },
                    },
                    {
                        $unwind: "$job",
                    },
                    {
                        $lookup: {
                            from: "company",
                            localField: "job.companyId",
                            foreignField: "_id",
                            as: "company",
                        },
                    },
                    {
                        $unwind: "$company",
                    },
                    {
                        $sort: { _id: -1 },
                    },
                ])
                .toArray();

            return applications;
        } catch (error) {
            console.error("Error getting applications by user ID:", error);
            throw error;
        }
    };

    createApplication = async (applicationData) => {
        try {
            const newApplication = await this.db
                .collection("applications")
                .insertOne(applicationData);

            return newApplication;
        } catch (error) {
            console.error("Error creating Application:", error);
            throw error;
        }
    };

    getSingleApplication = async (applicationId) => {
        try {
            const application = await this.db
                .collection("applications")
                .aggregate([
                    {
                        $match: { _id: new ObjectId(applicationId) },
                    },
                    {
                        $lookup: {
                            from: "jobs",
                            localField: "jobId",
                            foreignField: "_id",
                            as: "job",
                        },
                    },
                    {
                        $unwind: "$job",
                    },
                    {
                        $lookup: {
                            from: "company",
                            localField: "job.companyId",
                            foreignField: "_id",
                            as: "company",
                        },
                    },
                    {
                        $unwind: "$company",
                    },
                ])
                .next();

            return application;
        } catch (error) {
            console.error("Error getting application by ID:", error);
            throw error;
        }
    };

    updateApplication = async (applicationId, applicationData) => {
        try {
            const result = await this.db
                .collection("applications")
                .findOneAndUpdate(
                    { _id: new ObjectId(applicationId) },
                    { $set: applicationData },
                    { returnDocument: "after" }
                );

            if (result.matchedCount === 0) {
                throw new Error("Application not found!!");
            }

            const updatedApplication = await this.getSingleApplication(
                applicationId
            );
            return { success: true, updatedApplication };
        } catch (error) {
            console.error("Error updating application:", error);
            throw error;
        }
    };

    deleteApplication = async (applicationId) => {
        try {
            const deletedApplication = await this.db
                .collection("applications")
                .deleteOne({ _id: new ObjectId(applicationId) });

            if (deletedApplication.deletedCount === 0) {
                throw new Error("Application not found!!");
            }

            return {
                success: true,
                message: "Application deleted successfully!!",
            };
        } catch (error) {
            console.error("Error deleting the application:", error);
            throw error;
        }
    };
}
