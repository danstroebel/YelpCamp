const express = require("express");
const router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROUTES
router.get("/", function(req, res) {
    res.render("landing");
});

// AUTH ROUTES
router.get("/register", function(req, res) {
    res.render("register");
})

router.post("/register", function(req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            /* req.flash(err);
            return res.render("register"); */
            return res.render("register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, function() {
            console.log("Success");
            req.flash("success", "Hi " + user.username + ", welcome to YelpCamp!");
            res.redirect("/campground");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}), function(req, res) {
    res.send("You logged in");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campground");
});

module.exports = router;