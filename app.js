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

app.get('/', async(req, res) => {
    const title = "Welcome to Wiki API";
    const content = "Aquí, encontrarás una rica fuente de conocimiento que abarca desde los conceptos más básicos hasta los temas avanzados en una amplia gama de lenguajes y disciplinas de programación. Nuestra misión es proporcionar una plataforma de aprendizaje accesible, inclusiva y colaborativa para todos, sin importar si eres un completo principiante buscando aprender tu primer lenguaje de programación, un estudiante persiguiendo una educación formal en informática, o un profesional experimentado buscando mantenerse al día con las últimas tendencias y tecnologías."
    res.render("index", {title: title, content: content, articles: await find()});
})

app.get("/:_id", async(req, res) =>{
    const _id = req.params._id;
    const foundArticle = await findOne(_id);
    const {title, content} = foundArticle;
    res.render("index", {title: title, content: content,articles: await find()});
})

app.listen(3000, async function(){
    console.log("Server is running on port 3000");
    await connectDB();
})

