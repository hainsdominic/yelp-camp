var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware/index.js');
// show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});  
        }
    });
});

// create a new campground
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Campground created successfully');
            res.redirect("/campgrounds")
        }
    });
});

// show form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// show a specific campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});
// UPDATE ROUTE

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground updated successfully');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

// DESTROY ROUTES

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground deleted successfully');
            res.redirect('/campgrounds');
        }
    })
});


module.exports = router;