const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var methodOverride = require("method-override");

//App configuration
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/dataup", {useNewUrlParser: true});
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//Mongoose/model configuration
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//   title:"Nature",
//   image : "https://images.unsplash.com/photo-1547231242-2d9033c5d8b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=767&q=80",
//   body: "hello this is the first post to the blog"
// })


// Restful Routes
app.get("/", (req, res) =>{
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) =>{
  Blog.find({}, (err, blogs) =>{
    if(err){
      console.log(err);
    } else{
        res.render("index", {blogs: blogs});
    }
  })
});
//New Route
app.get("/blogs/new", (req, res) =>{
  res.render("new");
})
//create
app.post("/blogs", (req, res) =>{
  Blog.create(req.body.blog, (err, newBlog) =>{
    if(err){
      console.log(err);
    }else{
        res.redirect("/blogs");
    }
  })
});

//Show Route
app.get("/blogs/:id",(req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) =>{
    if(err){
      console.log(err);
    } else{
      res.render("show",{blog: foundBlog});
    }
  });
});
//Edit Routes
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) =>{
    if(err){
      console.log(err);
    } else{
      res.render("edit", {blog: foundBlog})
    }
  });
});
//Update Routes
app.put("/blogs/:id", (req, res) =>{
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedblog) => {
    if(err){
      console.log(err);
    } else{
      res.redirect("/blogs/" + req.params.id);
    }
  });
});
//Delete Routes
app.delete("/blogs/:id", (req, res) =>{
  Blog.findByIdAndRemove(req.params.id, (err) =>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs");
    }
  });
});



const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`your app is running on port ${port}`);
});
