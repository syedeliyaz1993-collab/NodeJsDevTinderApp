// const adminAuth = (req, res, next) => {
//     console.log("Middleware for admin route");//This is a middleware function

//     const token = 'abcdefge';
//     const isAuthenticated = token === 'abcdefg'; // Simulating authentication check

//     if (isAuthenticated) {
//         next(); // User is authenticated, proceed to the next middleware or route handler
//     } else {
//         res.status(401).send("Unauthorized Admin access"); // User is not authenticated, send an error response
//     }

// }

// const userAuth = (req, res, next) => {
//     console.log("Middleware for admin route");//This is a middleware function

//     const token = 'xyz123';
//     const isAuthenticated = token === 'xyz123'; // Simulating authentication check

//     if (isAuthenticated) {
//         next(); // User is authenticated, proceed to the next middleware or route handler
//     } else {
//         res.status(401).send("Unauthorized User access"); // User is not authenticated, send an error response
//     }

// }

// module.exports = { adminAuth, userAuth };

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token, Please login again"
            });
        }

        const decoded = await jwt.verify(token, "mysecretkey");
        const user = await User.findById(decoded._id);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message || "Authentication failed"
        });
    }
};

module.exports = { userAuth };