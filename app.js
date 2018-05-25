const
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

//seedDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelp_camp");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campground", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    })
});

app.post("/campground", function(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = { name: name, image: image, description: description };
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("campground");
        }
    });
});

app.get("/campground/new", function(req, res) {
    res.render("campgrounds/new");
});

app.get("/campground/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        res.render("campgrounds/show", { campground: foundCampground });
    })
});

app.get("/campground/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render("comments/new", { campground: campground });
    })
});

app.post("/campground/:id/comments", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campground/" + campground.id);
                }
            })
        }
    })
});

app.listen(3000, function() {
    console.log("YelpCamp ready.");
});