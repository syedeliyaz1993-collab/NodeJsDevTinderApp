const express = require("express");
const app = express();

app.use('/express', (req, res) => {
    res.send("Hello World from Express!");
});
app.use("/", (req, res) => {
    res.send("Am From Namaste Node Js !");
});
app.listen(3000);