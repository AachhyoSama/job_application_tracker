import express from "express";
import { AuthModel } from "../models/authModel.js";
import { generateToken } from "../utils/authUtil.js";

const authController = express.Router();
const authModel = new AuthModel();

// Connect to the database
authModel.connect();

// Register a new user
authController.post("/register", async (req, res) => {
    try {
        const { email, password, firstname, lastname, address, role } =
            req.body;

        // Check if the user with the given email already exists
        const userExists = await authModel.doesUserExist(email);
        if (userExists) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // Create a new user with the provided or default role
        const newUser = await authModel.createUser({
            email,
            password,
            firstname,
            lastname,
            address,
            role,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: newUser,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login a user
authController.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await authModel.findUserByEmail(email);

        // Check if the user exists and validate credentials
        if (
            user &&
            (await authModel.validateUserCredentials(email, password))
        ) {
            // Generate a JWT token
            const token = generateToken(user);

            res.status(200).json({
                success: true,
                message: "Login successful!",
                data: {
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    address: user.address,
                    role: user.role,
                    token: token,
                },
            });
        } else {
            res.status(401).json({ error: "Invalid credentials!" });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default authController;
