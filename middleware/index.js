var Friend          = require("../models/friend"),
    Human           = require("../models/human"),
    Breed           = require("../models/breed"),
    multer          = require("multer"),
    petfinder       = require("petfinder")("37a7e429557d82083bea50a3525de2c9", "3ef5471d7cded3a0201f001f83d46a5f"); 


module.exports = {
    isLoggedIn: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You must be logged in to do that");
        res.redirect("/login");
    },
    
    
    checkFriendOwner: function(req, res, next) {
        if(req.isAuthenticated()){
            Friend.findOne({url: req.params.friend_url}, function(err, foundFriend){
                if(err){
                    return console.log(err.message);
                }
                if(foundFriend.human.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Looks like you don't have permission to do that.");
                    res.redirect("back");
                }
            });    
        } else {
            req.flash("error", "You have to be logged in to do that.");
            res.redirect("/login");
        }
        
    },
    
    
    
    
    
    checkHumanOwner: function(req, res, next) {
        if(req.isAuthenticated()){
            Human.findById(req.params.human_id, function(err, foundHuman){
                if(err){
                    return console.log(err.message);
                }
                if(foundHuman._id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Looks like you don't have permission to do that.");
                    res.redirect("back");
                }
            });    
        } else {
            req.flash("error", "You have to be logged in to do that.");
            res.redirect("/login");
        }
        
    },
    
    
    
    canPostFunc: function(req, res, next) {
        Human.findById(req.params.human_id, function(err, foundHuman){
            if(err){
                return console.log(err.message);
            }
            if(req.user.canPost){
                next();
            } else {
                req.flash("error", "You must wait before doing that again");
                res.redirect("back");
            }
        }); 
    },

    error: function(req, res, err, message) {
        console.log(err);
        if(message) {
            req.flash("error", message);
        } else {
            req.flash("error", "An error has occured");
        }
        res.redirect("/feed/1");
    }

    
  
};




