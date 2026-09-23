const express = require('express');
const { userAuth } = require('../middlewares/Auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user; // Access the authenticated user from the request object

    res.send(user.firstName + " " + "Sent Connection request sent successfully");
});


module.exports = requestRouter;