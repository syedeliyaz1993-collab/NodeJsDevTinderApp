const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
    try {
        validateSignUpData(req); // Validate the incoming request data

        const { firstName, lastName, emailId, password, age, gender, skills, about } = req.body;

        const passwordHash = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt round of 10

        const user = new User({ firstName, lastName, emailId, password: passwordHash, age, gender, skills, about });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "User signed up successfully",
            data: user
        });
    } catch (err) {
        console.error("Error saving user:", err.message);
        return res.status(400).json({
            success: false,
            message: err.message || "Signup failed"
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const isUserExist = await User.findOne({ emailId: emailId });
        if (!isUserExist) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordMatch = await isUserExist.validatePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const jwtToken = await isUserExist.getJWT();
        res.cookie("token", jwtToken);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: isUserExist
        });
    } catch (err) {
        console.error("Error saving user:", err.message);
        return res.status(401).json({
            success: false,
            message: err.message || "Login failed"
        });
    }
});


authRouter.post("/logout", (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: "Logout Successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Logout failed"
        });
    }
});


module.exports = authRouter;