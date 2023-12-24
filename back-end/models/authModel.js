import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { DATABASE_CONFIG } from "../config/database.config.js";

export class AuthModel {
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

    createUser = async (userData) => {
        try {
            const newUser = await this.db
                .collection("users")
                .insertOne(userData);
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    };

    findUserByEmail = async (email) => {
        try {
            const user = await this.db.collection("users").findOne({ email });
            return user;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    };

    doesUserExist = async (email) => {
        try {
            const user = await this.db.collection("users").findOne({ email });
            return user !== null;
        } catch (error) {
            console.error("Error checking if user exists:", error);
            throw error;
        }
    };

    validateUserCredentials = async (email, password) => {
        try {
            const user = await this.db.collection("users").findOne({ email });

            if (!user) {
                return false;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            return passwordMatch;
        } catch (error) {
            console.error("Error validating user credentials:", error);
            throw error;
        }
    };

    hashPassword = async (password) => {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (error) {
            console.error("Error hashing password:", error);
            throw error;
        }
    };
}
