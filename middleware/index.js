// i didnt wrote that thrash lol shitty callbacks
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash('error', 'Campground not found');
                res.redirect("back");
            } else {
               // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have the permission to perform this action');
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'nice "hack"');
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash('error', 'Comment not found');
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have the permission to perform this action');
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'nice "hack"');
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to perform this action'); // pass a message under the key 'error' to /login 
    res.redirect("/login");
}

module.exports = middlewareObj;