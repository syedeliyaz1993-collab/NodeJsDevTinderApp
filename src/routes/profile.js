const express = require('express');
const { userAuth } = require('../middlewares/Auth');

const { validateProfileEditData } = require('../utils/validation')

const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request object
        res.send(user);

    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error('Invalid Edit request');
        }

        const loggedInUser = req.user;
        //Now Loop thru loggedinUser and update the req.body
        //Inhort whatever is coming from req.body is input sent by user and we have alread loggedinuser from user auth middleware
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

        //Now save this update to DB
        await loggedInUser.save();

        res.send(`${loggedInUser.firstName} your profile updated successfully`);


    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }
})

module.exports = profileRouter;