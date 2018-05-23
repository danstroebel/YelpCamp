const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgrounds = [
    {name:"Fish Creek", image: "https://muenchen-res.cloudinary.com/.imaging/stk/responsive/image980/dms/lhm/tourismus/camping-l/document/camping-l.jpg"},
    {name:"Haunte Grove", image:"https://bestbrands-4001.kxcdn.com/wp-content/uploads/2015/12/camping-tent.jpg"},
    {name: "Ranger's Delight", image:"http://s3.amazonaws.com/ncc-ccn/images/_cardWide/camping-card.jpg?mtime=20170425165109" },
    {name: "Reihenhaus", image:"http://s3.amazonaws.com/ncc-ccn/images/_cardWide/group-camping.jpg?mtime=20180426155434"},
    {name:"Snowy Rivers", image:"http://s3.amazonaws.com/ncc-ccn/images/_cardWide/winter-camping.jpg?mtime=20180425155227"},
    {name:"Autumn Splendor", image:"https://www.nps.gov/buff/planyourvisit/images/backpacking2.jpg?maxwidth=650&autorotate=false"}
];


app.get("/", function (req, res) {
   res.render("landing");
  });

app.get("/campground", function (req, res) {
    res.render("campground", {campgrounds: campgrounds});
   });

app.post("/campground", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {name: name, image:image};
    campgrounds.push(newCampground);
    res.redirect("campground");
});

app.get("/campground/new", function (req, res) {
    res.render("new");
   });


app.listen(3000, function () {
    console.log("YelpCamp ready.");
});