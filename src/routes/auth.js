const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {

    validateSignUpData(req); // Validate the incoming request data
    //encrpt the paassword before saving to the database

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt round of 10

    //Create a new instance for USer model & Now send the fields to User Model Instead
    //Of sending req.body directly
    const user = new User({ firstName, lastName, emailId, password: passwordHash }); // Create a new user instance with the hashed password


    //Always use try & catch for handling DB operations as they are async in nature and can throw errors
    try {
        await user.save(); // Save the user to the database  
        res.send("User signed up successfully");
    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }
});

authRouter.post("/login", async (req, res) => {

    try {
        //Get the user credentails which they trued to enter to login 

        const { emailId, password } = req.body;
        //Now check the email is exist in our DB 
        const isUseExist = await User.findOne({ emailId: emailId });
        if (!isUseExist) {
            throw new Error("User not found with the provided emailId");
        }

        //Now decrypt the password and check if it matches with the password in DB
        const isPasswordMatch = await isUseExist.validatePassword(password); // Call the instance method to validate the password
        if (isPasswordMatch) {

            const jwtToken = await isUseExist.getJWT();

            res.cookie("token", jwtToken); // Seting  a Dynamic cookie named "token"

            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid password");
        }


    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }

});


authRouter.post("/logout", (req, res) => {

    res.cookie('token', null, { expiresIn: Date.now() });

    res.send('Logout Successfully');
});


module.exports = authRouter;