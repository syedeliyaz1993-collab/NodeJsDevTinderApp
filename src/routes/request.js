const express = require('express');
const { userAuth } = require('../middlewares/Auth');

const User = require('../models/user')

const connectionRequest = require('../models/connectionRequest');

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
        const toUserExist = await User.findById(toUserId);
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

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    //As we have defined userAuth middle as we are attching the loggedIn user post authentication in middle ware we will take from req.user

    try {
        //Take LoggedIn user from req 
        //Check for status accepted or rejected
        //find the obj with and save to db 
        //the requested which we are gng to accept shd be interested in status
        //toUserId is logged in user Id
        //request id _id

        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(401).json({ message: "Given status is not allowed " + status });
        }

        const findValidConnection = await connectionRequest.findOne({
            status: "interested",
            toUserId: loggedInUser._id,
            _id: requestId
        });

        if (!findValidConnection) {
            return res.status(401).json({ message: "Connection request is not found " });
        }
        //Now update the status which is coming from API
        findValidConnection.status = status;
        //Save to DB
        const data = await findValidConnection.save();

        res.send({ message: `Connection request ${status} was updated succesfully`, data })

    }
    catch (err) {

        res.status(400).send('ERROR : ' + err.message);
    }


})


module.exports = requestRouter;

