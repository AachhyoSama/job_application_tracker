import { MongoClient, ObjectId } from "mongodb";
import { DATABASE_CONFIG } from "../config/database.config.js";

export class JobModel {
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

    getAllJobs = async () => {
        try {
            const jobs = await this.db
                .collection("jobs")
                .aggregate([
                    {
                        $lookup: {
                            from: "company",
                            localField: "companyId",
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

            return jobs;
        } catch (error) {
            console.error("Error getting all jobs:", error);
            throw error;
        }
    };

    createJob = async (jobData) => {
        try {
            const newJob = await this.db.collection("jobs").insertOne(jobData);
            return newJob;
        } catch (error) {
            console.error("Error creating Job:", error);
            throw error;
        }
    };

    getSingleJob = async (jobId) => {
        try {
            const job = await this.db
                .collection("jobs")
                .aggregate([
                    {
                        $match: { _id: new ObjectId(jobId) },
                    },
                    {
                        $lookup: {
                            from: "company",
                            localField: "companyId",
                            foreignField: "_id",
                            as: "company",
                        },
                    },
                    {
                        $unwind: {
                            path: "$company",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ])
                .next();

            return job;
        } catch (error) {
            console.error("Error getting job by ID:", error);
            throw error;
        }
    };

    updateJob = async (jobId, jobData) => {
        try {
            const result = await this.db
                .collection("jobs")
                .findOneAndUpdate(
                    { _id: new ObjectId(jobId) },
                    { $set: jobData },
                    { returnDocument: "after" }
                );

            if (result.matchedCount === 0) {
                throw new Error("Job not found!!");
            }

            const updatedJob = await this.getSingleJob(jobId);
            return { success: true, updatedJob };
        } catch (error) {
            console.error("Error updating job:", error);
            throw error;
        }
    };

    deleteJob = async (jobId) => {
        try {
            const deletedJob = await this.db
                .collection("jobs")
                .deleteOne({ _id: new ObjectId(jobId) });

            if (deletedJob.deletedCount === 0) {
                throw new Error("Job not found!!");
            }

            return { success: true, message: "Job deleted successfully!!" };
        } catch (error) {
            console.error("Error deleting the job:", error);
            throw error;
        }
    };
}
