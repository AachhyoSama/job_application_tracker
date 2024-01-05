// authController.js
import express from "express";
import { AuthModel } from "../models/authModel.js";
import { generateToken } from "../utils/authUtil.js";

const authController = express.Router();
const authModel = new AuthModel();

authModel.connect();

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

            res.status(200).json({
                success: true,
                message: "Login successful!",
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        address: user.address,
                        role: user.role,
                    },
                    token,
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

authController.post("/logout", (req, res) => {
    // Since JWT is stateless, logout is client-side by clearing the token
    res.status(200).json({ success: true, message: "Logout successful!!" });
});

export default authController;
