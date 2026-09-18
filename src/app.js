const express = require("express");
const app = express();


///Route params and dynamic routing

app.get("/user", (req, res) => {
    console.log(req.query);
    res.send({
        "fName" : "syed",
        "lName": "Eshaan"
    });
});
app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({
        "fName" : "syed",
        "lName": "Eshaan"
    });
});


app.post("/user", (req, res) => {
    res.send("Data saved successfully");
});


app.delete("/user", (req, res) => {
    res.send("User deleted successfully");
});




app.use('/express', (req, res) => {
    res.send("Hello World from Express!");
});
app.use("/", (req, res) => {
    res.send("Am From Namaste Node Js !");
});
app.listen(3000);