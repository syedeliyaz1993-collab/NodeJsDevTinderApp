const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library for JWT token generation
const bcrypt = require("bcrypt"); // Importing the bcryptjs library for password hashing

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
            if (!validator.isEmail(value)) {
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



//Offloading the JWT Token from file to User Model itself so that we can call it from anywhere in the app

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: this._id }, "mysecretkey", { expiresIn: "1d" });
    return token;
};

//Offloading the passwording hashing 
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordMatch = await bcrypt.compare(passwordInputByUser, this.password);
    return isPasswordMatch;
}

const User = mongoose.model("User", userSchema);

module.exports = User;