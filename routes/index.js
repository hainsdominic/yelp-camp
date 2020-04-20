var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//show landing page
router.get("/", (req, res) => {
    res.render("landing");
});

//show register form
router.get('/register', (req, res) => {
    res.render('register');
});

//register new user
router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp, ' + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//login user
router.post('/login', passport.authenticate('local', {
        successRedirect: '/campgrounds', 
        failureRedirect: '/login' 
    }), 
    (req, res) => {
});

//logout user
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out');
    res.redirect('/campgrounds');
});

module.exports = router;