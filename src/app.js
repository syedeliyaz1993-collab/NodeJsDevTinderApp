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

app.use(express.json()); // Middleware to parse JSON request bodies
app.post("/signUp", async (req, res) => {

    //Create a new instance for USer model
    const user = new User(req.body);
    //Always use try & catch for handling DB operations as they are async in nature and can throw errors
    try {
        await user.save(); // Save the user to the database  
        res.send("User signed up successfully");
    } catch (err) {
        console.error("Error saving user:", err.message);
        res.status(500).send("Error signing up user");
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