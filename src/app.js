const express = require("express");
const app = express();



app.get("/user", (req, res) => {
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