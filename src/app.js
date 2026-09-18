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
app.use("/admin", (req, res, next) => {
    console.log("Middleware for admin route");//This is a middleware function

    const token = 'abcdefge';
    const isAuthenticated = token === 'abcdefg'; // Simulating authentication check

    if (isAuthenticated) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).send("Unauthorized access"); // User is not authenticated, send an error response
    }

});

app.get("/admin/getData", (req, res) => {
    console.log("Admin route handler");
    res.send("Hello Admin! You are authenticated.");
});

app.delete("/admin/deleteData", (req, res) => {
    console.log("Admin delete route handler");
    res.send("Admin delete action performed.");
});

app.listen(3000);