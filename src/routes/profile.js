const express = require('express');
const { userAuth } = require('../middlewares/Auth');
const bcrypt = require('bcrypt');

const { validateProfileEditData, validateForgotPassword } = require('../utils/validation')

const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user
        });
    } catch (err) {
        console.error("Error fetching profile:", err.message);
        return res.status(400).json({
            success: false,
            message: err.message || "Profile fetch failed"
        });
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error('Invalid Edit request');
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();

        return res.status(200).json({
            success: true,
            message: `${loggedInUser.firstName} your profile updated successfully`,
            data: loggedInUser
        });
    } catch (err) {
        console.error("Error updating profile:", err.message);
        return res.status(400).json({
            success: false,
            message: err.message || "Profile update failed"
        });
    }
});


profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        if (!validateForgotPassword(req)) {
            throw new Error("Invalid Fields");
        }

        const loggedInUser = req.user;
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        return res.status(200).json({
            success: true,
            message: `${loggedInUser.firstName} your profile password updated successfully`
        });
    } catch (err) {
        console.error("Error updating password:", err.message);
        return res.status(400).json({
            success: false,
            message: err.message || "Password update failed"
        });
    }
});

module.exports = profileRouter;