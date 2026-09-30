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

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Given status is not accepted: " + status);
        }

        const toUserExist = await User.findById(toUserId);
        if (!toUserExist) {
            throw new Error("User is Not Found");
        }

        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({
                success: false,
                message: "Connection request already exists"
            });
        }

        const connectRequestInstance = new connectionRequest({
            fromUserId, toUserId, status
        });

        const connectionReqData = await connectRequestInstance.save();
        return res.status(200).json({
            success: true,
            message: "Connection Request has been sent succesfully",
            data: connectionReqData
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to send connection request"
        });
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Given status is not allowed " + status
            });
        }

        const findValidConnection = await connectionRequest.findOne({
            status: "interested",
            toUserId: loggedInUser._id,
            _id: requestId
        });

        if (!findValidConnection) {
            return res.status(404).json({
                success: false,
                message: "Connection request is not found"
            });
        }

        findValidConnection.status = status;
        const data = await findValidConnection.save();

        return res.status(200).json({
            success: true,
            message: `Connection request ${status} was updated succesfully`,
            data
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to review connection request"
        });
    }
});


module.exports = requestRouter;

