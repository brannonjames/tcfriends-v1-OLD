var express         = require("express"),
    router          = express.Router(),
    Human           = require("../models/human"),
    Friend          = require("../models/friend"),
    Image           = require("../models/image"),
    passport        = require("passport"),
    multer          = require("multer"),
    queryString     = require("query-string"),
    zipcodes        = require("zipcodes");



 
function compare(a, b) {
    if (a.score > b.score){
        return -1;
    }    
    if (a.score < b.score){
        return 1;
    }    
    return 0;
} 
 
                                                                                    // LANDING
 
router.get("/", function(req, res) {
    res.render("landing");
}); 
 
 
                                                                                    // FEED

router.get("/feed/:page", function(req, res) {
    var page = Number(req.params.page);
    var friendsPerPage = 22;
    var filterParams = new Object();
    if(req.query) {
        filterQueryString = "?" + queryString.stringify(req.query);
        if(req.query.animal) {
            filterParams["friend.animal"] = req.query.animal;
        }
        if(req.query.sex) {
            filterParams["friend.sex"] = req.query.sex;
        }
        if(req.query.age) {
            filterParams["friend.age"] = req.query.age;
        }
    }
        
    Image.find(filterParams, function(err, images) {
        if(err){
            return middle.error(req, res, err);
        }
        var numPages = Math.ceil(images.length / friendsPerPage);
        if (images.length > 0) {
            if(page > numPages) {
                res.redirect("/feed/" + numPages + filterQueryString);
            }
            else if(page < 1) {
                res.redirect("/feed/1" + filterQueryString);
            } else {
                images = images.sort(compare);
                images = images.slice((friendsPerPage * page) - friendsPerPage, (friendsPerPage * page));
                res.render("feed", {images: images, page: page, numPages: numPages, query: req.query});
            }
        } else {
            res.render("feed", {images: images, page: page, numPages: numPages, query: req.query, filterQueryString: filterQueryString});
        }
    }); 
});


                                                                                    // REGISTER

router.get("/register", function(req, res) {
    if(req.session.tempUser && !req.session.tempUser.seen) {
        req.session.tempUser.seen = true;
        res.render("register", {temp: req.session.tempUser});
    }
    else {
        req.session.tempUser = {};
        res.render("register", {temp: req.session.tempUser});
    }
});


router.post("/register", function(req, res) {
    req.session.tempUser = req.body.user;
    req.session.tempUser.username = req.body.username;
    if (req.body.password !== req.body.passwordConfirm) {
        req.session.tempUser.seen = false;
        req.flash("error", "Passwords do not match");
        res.redirect('/register');
    } 
    else if (!req.body.user.firstName || !req.body.user.lastName || !req.body.user.zip || !req.body.username || !req.body.password || !req.body.passwordConfirm) {
        req.session.tempUser.seen = false;
        req.flash("error", "Please fill out all the fields");
        res.redirect("/register");
    }
    else {
        req.session.tempUser = {};
        req.body.user.username = req.body.username;
        Human.register(req.body.user, req.body.password, function(err, user) {
            if(err) {
                req.flash("error", err.message);
                res.redirect("back");
                return console.log(err.message);
            }
            var cityState = zipcodes.lookup(user.zip);
            user.city = cityState.city + ", " + cityState.state;
            user.dp.url = "/default_dp.png";
            user.canPost = true;
            user.postStatus = 0;
            user.save();
            passport.authenticate("local")(req, res, function(){
                res.redirect("/humans/" + req.user._id);
            });
           
        });
    }
});





                                                                                        // LOGIN


router.get("/login", function(req, res) {
    res.render("login");
});



router.post("/login", passport.authenticate("local", {
    successRedirect: "/feed/1",
    failureFlash: "Invalid username or password",
    failureRedirect: "/login",
}), function(req, res) {

});


                                                                                    // LOGOUT



router.post("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("back");
});



module.exports = router;