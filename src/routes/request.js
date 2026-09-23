const express = require('express');
const { userAuth } = require('../middlewares/Auth');

const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user')

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //Check for allowed status
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Given status is not accepted: " + status);
        }

        //Check the toUserId
        const toUserExist = await User.findById({ toUserId });
        if (!toUserExist) {
            throw new Error("User is Not Found");
        }
        //cannot send req to own userId
        // we can write here also but we are writing in schema itself

        //check for duplicate connections
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        //create new instance & send  to DB and Save
        const connectRequestInstance = new connectionRequest({
            fromUserId, toUserId, status
        });

        const connectionReqData = await connectRequestInstance.save();
        res.json({ message: "Connection Request has been sent succesfully", connectionReqData });

    } catch (err) {

        res.status(400).send('ERROR : ' + err.message);
    }

});


module.exports = requestRouter;