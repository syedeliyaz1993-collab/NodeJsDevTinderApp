const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
         ref : "User"
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is Incorret Status Type`
        }
    }
}, {
    timestamps: true
});

//Avoiding sending req to self 

connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send conenction request to yourself !")
    }
})
//1 is Ascending Order -1 is Descending order
//Compunding index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequest;

