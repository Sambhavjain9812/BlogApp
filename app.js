var express= require("express"),
expressSanitizer= require('express-sanitizer'),
methodOverride= require("method-override"),
bodyParser= require("body-parser"),
mongoose=require("mongoose"),
app= express();
port=80;

//CONNECTING IT TO MONGOOSE
mongoose.connect("mongodb://localhost:27017/Blog_app")

//BASIC EXPRESS APP
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs")
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MOONGOSE /MODEL CONFIG
var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:
    {
        type: Date, default: Date.now
    }
});
var Blog= mongoose.model("Blog",blogSchema);
 
// Blog.create({
//     title :"Test blog",
//     image: "https://media.istockphoto.com/photos/beautiful-mango-beach-in-saranda-albania-picture-id517851473?s=612x612",
//     body: "BLOG POST IT IS"
// })

//RESTFUL ROUTES
app.get("/", function(req,res){
res.redirect("/blogs");
})
app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});
        }
    })
  
})

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
})

// CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body= req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
          }
    })
})

//SHOW
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
              res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    })
})

//EDIT
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
              res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    })

})

// update
app.put("/blogs/:id", function(req,res){
    req.body.blog.body= req.sanitize(req.body.blog.body);
//    Blog.findByIdAndUpdate(id, newData, callback)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
       if(err){
           res.redirect("/blogs");

       }
       else{
           res.redirect("/blogs/"+ req.params.id);
       }
   })
})

//Delete
app.delete("/blogs/:id",function(req,res){
// destroy blog
Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
        res.redirect("/blogs");
    }else{
        res.redirect("/blogs");
    }
})
})
app.listen(port,function(){
    console.log(`The  Blog app is on at port ${port}`);
})