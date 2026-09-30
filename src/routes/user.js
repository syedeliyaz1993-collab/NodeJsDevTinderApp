const express = require('express');
const { userAuth } = require('../middlewares/Auth');
const connectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const UserCollectionData = "firstName lastName";

userRouter.get('/user/request/received', userAuth, async (req, res) => {

    try {

        const loggedInUser = req.user;
        console.log(loggedInUser)

        const findAllRequestReceivedToUser = await connectionRequest.find({
            status: "interested",
            toUserId: loggedInUser._id
        }).populate("fromUserId", UserCollectionData);

        return res.status(200).json({
            success: true,
            message: "Data fetched succesfully",
            data: findAllRequestReceivedToUser
        });




    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to fetch received requests"
        });
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const findAllMyConnectionReq = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId', UserCollectionData).populate('toUserId', UserCollectionData);

        const finalData = findAllMyConnectionReq.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }

            return row.fromUserId;
        });

        return res.status(200).json({
            success: true,
            message: "Fetched All Data Connections",
            data: finalData
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to fetch connections"
        });
    }
});

userRouter.get("/users/feed", userAuth, async (req, res) => {
    try {
        const loginUser = req.user;
        const skip = Number(req.query.page) || 0;
        let limit = Number(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const findConnectionReq = await connectionRequest.find({
            $or: [
                { toUserId: loginUser._id },
                { fromUserId: loginUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUser = new Set();

        findConnectionReq.forEach(req => {
            hideUser.add(req.fromUserId.toString());
            hideUser.add(req.toUserId.toString());
        });

        const feedUser = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUser) } },
                { _id: { $nin: loginUser._id } }
            ]
        }).select(UserCollectionData).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            message: "Feed fetched successfully",
            data: feedUser
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Failed to fetch feed"
        });
    }
});

module.exports = userRouter;