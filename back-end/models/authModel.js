import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { DATABASE_CONFIG } from "../config/database.config.js";

export class AuthModel {
    constructor() {
        this.client = new MongoClient(DATABASE_CONFIG.DATABASE_URL);
        this.db = null;
    }

    // Connect to the database
    connect = async () => {
        try {
            await this.client.connect();
            this.db = this.client.db(DATABASE_CONFIG.DATABASE_NAME);
        } catch (error) {
            console.error("Error connecting to the database:", error);
            throw error;
        }
    };

    // Disconnect from the database
    disconnect = async () => {
        try {
            await this.client.close();
            console.log("Disconnected from the database!!");
        } catch (error) {
            console.error("Error disconnecting from the database:", error);
            throw error;
        }
    };

    // Create a new user
    createUser = async (userData) => {
        try {
            // Hash the user's password before saving to the database
            const hashedPassword = await this.hashPassword(userData.password);

            // Include hashed password and role in user data
            const userToCreate = {
                email: userData.email,
                password: hashedPassword,
                firstname: userData.firstname,
                lastname: userData.lastname,
                address: userData.address,
                role: userData.role || "user", // Default role is "user"
            };

            const newUser = await this.db
                .collection("users")
                .insertOne(userToCreate);
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    };

    // Find a user by email
    findUserByEmail = async (email) => {
        try {
            const user = await this.db.collection("users").findOne({ email });
            return user;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    };

    // Check if a user with a given email exists
    doesUserExist = async (email) => {
        try {
            const user = await this.db.collection("users").findOne({ email });
            return user !== null;
        } catch (error) {
            console.error("Error checking if user exists:", error);
            throw error;
        }
    };

    // Validate user credentials (for login)
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

    // Hash the user's password before saving to the database
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
