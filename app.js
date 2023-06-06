const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const {Schema} = mongoose;

app.set('view engine', "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));


const articleSchema = new Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema);

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/wikiDB')
        console.log("Connected succesfully to server");
    }catch(e){
        console.log(e);
    }
}

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})