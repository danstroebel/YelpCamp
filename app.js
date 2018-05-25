const
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

// seedDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/yelp_camp");

// AUTH
app.use(require("express-session")({
    secret: "penis",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

// ROUTES
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campground", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
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

app.get("/campground/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render("comments/new", { campground: campground });
    })
});

app.post("/campground/:id/comments", isLoggedIn, function(req, res) {
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

// AUTH ROUTES
app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", function(req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            console.log("Success");
            res.redirect("/campground");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}), function(req, res) {
    res.send("You logged in");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campground");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.listen(3000, function() {
    console.log("YelpCamp ready.");
});