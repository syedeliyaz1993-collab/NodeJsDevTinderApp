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

        const data = findAllRequestReceivedToUser;
        res.send({ message: "Data fetched succesfully", data });




    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {

    // userAuth adds the authenticated user's document to req.user.
    const loggedInUser = req.user;

    // Find accepted requests where the logged-in user is either the sender or recipient.
    // Populate both user references with only their first and last names.
    const findAllMyConnectionReq = await connectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" }
        ]
    }).populate('fromUserId', UserCollectionData).populate('toUserId', UserCollectionData);


    // Return the other person from each accepted request, not the logged-in user.
    const finalData = findAllMyConnectionReq.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId;
        }

        return row.fromUserId;
    });

    // Send the list of connected users to the client.
    res.send({ message: "Fetched All Data Connections", finalData });

});

userRouter.get("/users/feed", userAuth, async (req, res) => {

    //Take the Login User
    const loginUser = req.user;
    //FInd all the connection my id will be in to or From 
    const skip = req.query.page;
    let limit = req.query.limit;
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
    //Now remove hideUser & Self id in feed
    //Means I who has sent connection and who has sent connection to me

    const feedUser = await User.find({
        //Here we need to filter on 2 so using and query
        $and: [
            { _id: { $nin: Array.from(hideUser) } },
            { _id: { $nin: loginUser._id } }
        ]
    }).select(UserCollectionData).skip(skip).limit(limit);

    //

    res.send(feedUser);
});

module.exports = userRouter;