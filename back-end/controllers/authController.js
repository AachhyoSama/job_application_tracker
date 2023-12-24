import express from "express";
import session from "express-session";
import { AuthModel } from "../models/authModel.js";
import { generateToken } from "../utils/authUtil.js";
import crypto from "crypto";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const authController = express.Router();
const authModel = new AuthModel();

authModel.connect();

// Generate a random 32-character hexadecimal key for session
const secretKey = crypto.randomBytes(16).toString("hex");

// Set up session middleware
authController.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
    })
);

authController.post("/register", async (req, res) => {
    try {
        const { email, password, firstname, lastname, address, role } =
            req.body;

        const userExists = await authModel.doesUserExist(email);
        if (userExists) {
            return res.status(400).json({ error: "User already exists!" });
        }

        const hashedPassword = await authModel.hashPassword(password);

        const newUser = {
            email,
            password: hashedPassword,
            firstname,
            lastname,
            address,
            role: role || "user",
        };

        await authModel.createUser(newUser);

        // Store user data in session
        req.session.user = newUser;

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

authController.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authModel.findUserByEmail(email);

        if (
            user &&
            (await authModel.validateUserCredentials(email, password))
        ) {
            const token = generateToken(user);

            // Store user data in session
            req.session.user = {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                address: user.address,
                role: user.role,
            };

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

authController.post("/logout", authenticateUser, (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(200).json({
                success: true,
                message: "Logout successful!",
            });
        }
    });
});

export default authController;
