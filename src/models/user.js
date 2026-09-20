const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email Address");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            const validGenders = ["male", "female", "other"];
            if (!validGenders.includes(value)) {
                throw new Error("Invalid gender value");
            }
        }
    },
    skills: {
        type: [String],
    }

}, 
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

module.exports = User;