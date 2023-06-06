const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})