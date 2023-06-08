const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
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
    const uri = "mongodb://localhost:27017/wikiDB";

    try{
        await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected succesfully to server");
    }catch(error){
        console.log(error.message);
    }
}

async function find(){
    try{
        const articles = await Article.find({}, 'title content').exec();
        return articles;
    }catch(error){
        console.log(error.message);
    }
}

async function findOne(id){
    try{
        const article = await Article.findOne({_id: id}, "title content").exec();
        return article;
    }catch(error){
        console.log(error.message);
    }
}

async function save(title, content){
    try{
        const article = new Article({
            title:title,
            content: content
        });
        await article.save();
    }catch(error){
        console.log(error.message);
    }
}

app.get('/', async(req, res) => {
    const title = "Welcome to Wiki API";
    const content = "<p>Here, you'll find a rich source of knowledge ranging from the most basic concepts to advanced topics in a wide range of programming languages and disciplines. Our mission is to provide an accessible, inclusive, and collaborative learning platform for everyone, whether you are a complete beginner looking to learn your first programming language, a student pursuing a formal computer science education, or a seasoned professional looking to keep up with the latest developments. latest trends and technologies.</p> <pre><code class='language-javascript'>console.log('Welcome and Enjoy!');</code></pre>";
    res.render("index", {title: title, content: content, articles: await find()});
})

app.get("/article/:_id", async(req, res) =>{
    const _id = req.params._id;
    const foundArticle = await findOne(_id);
    const {title, content} = foundArticle;
    res.render("article", {title: title, content: content,articles: await find()});
})

app.get("/compose", (req,res) => {
    res.render("compose" );
})

app.post("/", async(req,res) => {
    await save(req.body.title, req.body.content);
    res.redirect("/");
})

app.listen(3000, async function(){
    console.log("Server is running on port 3000");
    await connectDB();
})



