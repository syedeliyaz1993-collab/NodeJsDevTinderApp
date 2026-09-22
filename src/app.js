const express = require("express");
const app = express();


///Route params and dynamic routing

// app.get("/user", (req, res) => {
//     console.log(req.query);
//     res.send({
//         "fName" : "syed",
//         "lName": "Eshaan"
//     });
// });
// app.get("/user/:userId", (req, res) => {
//     console.log(req.params);
//     res.send({
//         "fName" : "syed",
//         "lName": "Eshaan"
//     });
// });


// app.post("/user", (req, res) => {
//     res.send("Data saved successfully");
// });


// app.delete("/user", (req, res) => {
//     res.send("User deleted successfully");
// });




// app.use('/express', (req, res) => {
//     res.send("Hello World from Express!");
// });
// app.use("/", (req, res) => {
//     res.send("Am From Namaste Node Js !");
// });


//**
// One route can have multiple route handlers
//  */



// app.use("/user",
//     (req, res) => {
//         console.log("Middleware 1");
//         res.send("Hello World from Express 1!");
//     },
//     (req, res) => {
//         console.log("Middleware 2");
//         res.send("Hello World from Express!");
//     }
// )

//Infinite Loop in middleware
// app.use("/user",
//     (req, res) => {
//         console.log("Middleware 1");
//         //res.send("Hello World from Express 1!");
//     },
//     (req, res) => {
//         console.log("Middleware 2");
//         res.send("Hello World from Express!");
//     }
// )

//2nd response will print as we dont have res in 1st route handler and we are calling next() to go to next route handler
// app.use("/user",
//     (req, res, next) => {
//         console.log("Middleware 1");
//         //res.send("Hello World from Express 1!");
//         next();
//     },
//     (req, res) => {
//         console.log("Middleware 2");
//         res.send("Hello World from Express 2!");
//     }
// );

//Will get error here as we are sending response in 1st route handler and calling next() to go to next route handler
// app.use("/user",
//     (req, res, next) => {
//         console.log("Middleware 1");
//         next();
//         res.send("Hello World from Express 1!");
//     },
//     (req, res) => {
//         console.log("Middleware 2");
//         res.send("Hello World from Express 2!");
//     }
//     //Error is => Cannot set headers after they are sent to the client
// );
/**
 * Route handlers can be passed as an array or as a list of arguments
 * app.use("route", rh1, rh2 ,rh3);
 * app.use("route", rh1, [rh2 ,rh3]);
 * app.use("route", [rh1, rh2 ,rh3]);
 * app.use("route", rh1, [rh2] ,rh3);
 */

//Middleware means a function which has access to the request and response object and can modify them. 
// It can also end the request-response cycle or call the next middleware in the stack.

// app.use("/user",
//     (req, res, next) => {
//         console.log("Middleware 1");//This is a middleware function
//         next();
//     },
//     (req, res) => {
//         console.log("Middleware 2");
//         res.send("Hello World from middleware 2!");//This is a route handler function
//     }
// );  

//Actual Middle ware function which can be used in multiple routes
//Now this is an middle ware function which can be used for multiple routes and can be used to check authentication or authorization of user

// const { adminAuth, userAuth } = require("./middlewares/Auth");
// app.use("/admin", adminAuth);

// //app.use("/user", userAuth);

// app.get("/user/getData", userAuth, (req, res) => {
//     console.log("User route handler");
//     res.send("Hello User! You are authenticated.");
// });

// app.get("/admin/getData", (req, res) => {
//     console.log("Admin route handler");
//     res.send("Hello Admin! You are authenticated.");
// });

// app.delete("/admin/deleteData", (req, res) => {
//     console.log("Admin delete route handler");
//     res.send("Admin delete action performed.");
// });

//Error handling middleware function


// app.get("/user/getData", (req, res) => {


//    throw new Error("User route error");
// });


// //always keep error handling middleware at the end of all route handlers and middlewares
// app.use("/",(err, req, res, next) => {
//     if(err) {
//         res.status(500).send('Something broke!');
//     }
// });

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json()); // Middleware to parse JSON request bodies
app.post("/signUp", async (req, res) => {
    validateSignUpData(req); // Validate the incoming request data
    //encrpt the paassword before saving to the database

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt round of 10





    //Create a new instance for USer model & Now send the fields to User Model Instead
    //Of sending req.body directly
    const user = new User({ firstName, lastName, emailId, password: passwordHash }); // Create a new user instance with the hashed password


    //Always use try & catch for handling DB operations as they are async in nature and can throw errors
    try {
        await user.save(); // Save the user to the database  
        res.send("User signed up successfully");
    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }
});

///Login API 

const jwt = require("jsonwebtoken");
app.post("/login", async (req, res) => {

    try {
        //Get the user credentails which they trued to enter to login 

        const { emailId, password } = req.body;
        //Now check the email is exist in our DB 
        const isUseExist = await User.findOne({ emailId: emailId });
        if (!isUseExist) {
            throw new Error("User not found with the provided emailId");
        }

        //Now decrypt the password and check if it matches with the password in DB
        const isPasswordMatch = await bcrypt.compare(password, isUseExist.password);
        if (isPasswordMatch) {

            const jwtToken = jwt.sign({ _id: isUseExist._id }, "mysecretkey"); //

            res.cookie("token", jwtToken); // Seting  a Dynamic cookie named "token"

            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid password");
        }


    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }

});

const cookieParser = require("cookie-parser");
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

app.get("/profile", async (req, res) => {

    try {

        const cookie = req.cookies;

        //console.log("Cookie : ", cookie);
        //Check if the cookie is present and has a token and handling the error if not present
        if (!cookie || !cookie.token) {
            throw new Error("No token found in cookies");
        }
        //Now verify the token and get the user id from it and then fetch the user from the DB
        //With the help of JWT verify method we can decode the token and get the user id from it and then fetch the user from the DB
        const decodedMsg = await jwt.verify(cookie.token, "mysecretkey");
        //console.log("Decoded Msg : ", decodedMsg);

        const user = await User.findById(decodedMsg._id);


        if (!user) {
            throw new Error("User not found");
        }

        res.send(user);

    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(400).send('ERROR : ' + err.message);
    }


})



//Get the user with emailId from the database and send them as a JSON response
app.get("/users", async (req, res) => {

    const userEmailId = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmailId }); // Fetch users from the database based on emailId
        if (users.length === 0) {
            return res.status(404).send("No users found with the provided emailId");
        }
        res.json(users); // Send the fetched users as a JSON response
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send("Error fetching users");
    }
});

//Get all users from the database and send them as a JSON response
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database   
        res.json(users); // Send the fetched users as a JSON response   
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send("Error fetching users");
    }
});

app.delete("/deleteUser", async (req, res) => {
    const userId = req.body.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId); // Delete the user from the database based on userId
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.send("User deleted successfully");
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).send("Error deleting user");
    }
});

//Exported and Imported the ConnectDB fn
//At first it connect to Db
//Then it starts the server
connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
});

//app.listen(3000);