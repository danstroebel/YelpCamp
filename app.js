const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create( {
//     name:"Autumn Splendor", 
//     image:"https://www.nps.gov/buff/planyourvisit/images/backpacking2.jpg?maxwidth=650&autorotate=false",
//     description: "Nice for summer, too cold for late autumn."
// });  


app.get("/", function (req, res) {
   res.render("landing");
  });

app.get("/campground", function (req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    })
   });

app.post("/campground", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = {name: name, image:image, description:description};
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.redirect("campground");
        }
    });    
});

app.get("/campground/new", function (req, res) {
    res.render("new");
   });

app.get("/campground/:id", function (req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("show", {campground: foundCampground});
    })
   });

app.listen(3000, function () {
    console.log("YelpCamp ready.");
});