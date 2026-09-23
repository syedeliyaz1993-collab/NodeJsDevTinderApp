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
        const token = req.cookies.token; // Assuming the token is stored in a cookie named "token"
        //console.log("Token from cookie:", token); // Log the token for debugging
        if (!token) {
            throw new Error("Invalid Token, Please login again");
        }
        const decoded = await jwt.verify(token, "mysecretkey");
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error("User not found");
        }
        //Once we find the user, we can attach it to the request object for further use in the route handler
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
};

module.exports = { userAuth };