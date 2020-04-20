var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//show form for new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Cannot find campground')
            return res.redirect('/campgounds')
        } else {
            res.render('comments/new', {campground: foundCampground});
        }
    });
});

//create new comment
router.post('/', middleware.isLoggedIn,(req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Cannot find campground')
            return res.redirect('/campgounds')
        } else {
            Comment.create(req.body.comment, (err, newComment) => {
                if (err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    req.flash('success', 'Comment created successfully');
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Cannot find campground')
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err || !updatedComment) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment updated successfully');
            res.redirect('/campgrounds/' + req.params.id)
        }
    });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

module.exports = router;