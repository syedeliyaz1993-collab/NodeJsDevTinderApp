const express = require('express');
const { userAuth } = require('../middlewares/Auth');
const connectionRequest = require('../models/connectionRequest');
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

    res.send({ message: "Fetched All Data Connections", finalData });

})

module.exports = userRouter;