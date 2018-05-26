const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/campground/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render("comments/new", { campground: campground });
    })
});

router.post("/campground/:id/comments", isLoggedIn, function(req, res) {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;