var express         = require("express"),
    router          = express.Router(),
    TmpFriend       = require("../models/tmpfriend"),
    Friend          = require("../models/friend"),
    Human           = require("../models/human"),
    Image           = require("../models/image"),
    multer          = require("multer"),
    Breed           = require("../models/breed"),
    Shelter         = require("../models/shelter"),
    middle          = require("../middleware"),
    cloudStorage    = require('multer-storage-cloudinary'),
    cloudinary      = require("cloudinary");
    
<<<<<<< HEAD

=======
  
>>>>>>> e360b725dffdfd8e6bc054976a0cd75d58cd22f8

var storage = cloudStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    transformation: {
        height: 500,
        width: 500,
        crop: "limit",
        secure: true,
        quality: 80
    },
    filename: function (req, file, cb) {
        cb(null, file.filename);
    }
});
 
var upload = multer({ storage: storage });




setInterval(function () {
    Image.find({}, function(err, images) {
        if(err){
            console.log(err);
        }
        images.forEach(function(image) {
            if(image.score > 60) {
                image.score -= 60;
                image.save();
            }
        });
    });
}, 43200000);


                                                                                // INDEX 


 router.get("/friends/page/:page", function(req, res) {
    Friend.find({}, function(err, allFriends) {
        if(err){
             return middle.error(req, res, err);
        }
        var page = Number(req.params.page);
        var friendsPerPage = 30;
        var numPages = Math.ceil(allFriends.length / friendsPerPage);
        if(allFriends.length > 0) {
        if(page > numPages) {
            res.redirect("/friends/page/" + numPages);
        }
        else if(page < 1) {
            res.redirect("/friends/page/1");
        }
        else if(page <= numPages && allFriends.length > 0) {
            Friend.find({}).limit(friendsPerPage).skip((page * friendsPerPage) - friendsPerPage).exec(function(err, foundFriends){
                if(err){
                    return middle.error(req, res, err);
                }
                res.render("friends/index", {friends: foundFriends, page: page, numPages: numPages}); 
            });
        }
        } else {
            res.render("friends/index", {friends: null, page: page, numPages: numPages});
        }
    });
 }); 
 

router.get("/friends/search/:friend_search", function(req, res) {
    Friend.find({lowerName: req.params.friend_search}, function(err, friends) {
        if(err) {
            return middle.error(req, res, err);
        }
        if(friends.length < 1) {
            req.flash("error", "We couldn't find any friends with that name");
            res.redirect("/friends/page/1");
        }
        else {
            res.render("friends/index", {friends: friends, page: 1, numPages: 1});
        }
    });
});
 

router.post("/friends/search", function(req, res) {
    if(req.body.search) {
        res.redirect("/friends/search/" + req.body.search.toLowerCase());
    } else {
        res.redirect("/friends/page/1")
    }
});

                                                                                // NEW

router.get("/friends/new", middle.isLoggedIn, function(req, res) {
    Breed.find({}, function(err, breeds) {
        if(err){
            return middle.error(req, res, err);
        }
        Shelter.find({}, function(err, shelters) {
            if(err){
                return middle.error(req, res, err);
            }
            function compare(a, b) {
                if (a.name < b.name){
                    return -1;
                }    
                if (a.name > b.name){
                    return 1;
                }    
                return 0;
            }
            shelters = shelters.sort(compare);
            res.render("friends/new", {breeds: breeds, shelters: shelters});
        });
    });
    
});


router.post("/friends/new", middle.isLoggedIn, function(req, res) {
    TmpFriend.create(req.body.friend, function(err, tmpFriend) {
        if(err) {
            return middle.error(req, res, err);
        }
        tmpFriend.lowerName = tmpFriend.name.toLowerCase();
        tmpFriend.save();
        Friend.find({lowerName: tmpFriend.lowerName}, function(err, foundFriends) {
            if(err){return middle.error(req, res, err);}
            var newId = tmpFriend.lowerName.replace(/\s+/g, '_') + String(foundFriends.length + 1);
            tmpFriend.url = newId;
            tmpFriend.human = {id: req.user._id, name: req.user.firstName};
            if(req.body.shelter){
                Shelter.findById(req.body.shelter, function(err, foundShelter, next) {
                    if(err) {
                        return middle.error(req, res, err);
                    }
                    if(foundShelter) {
                        tmpFriend.shelter = foundShelter;
                        tmpFriend.save();
                    } else {
                        next();
                    }
                });  
            }
            if(!tmpFriend.sex) {
                tmpFriend.sex = "Unknown Gender";
            } 
            if(!tmpFriend.age) {
                tmpFriend.age = "Unknown Age";
            }
            if(!tmpFriend.breed) {
                tmpFriend.breed = "Unknown Breed";
            }
            tmpFriend.save();
            res.redirect("/friends/new/more_info/" + tmpFriend._id);  
        });
    });
});


router.get("/friends/new/more_info/:tmpfriend_id", function(req, res) {
    TmpFriend.findById(req.params.tmpfriend_id).populate("shelter").exec(function(err, foundTmpFriend) {
        if (err) {
            return middle.error(req, res, err);
        }
        res.render("friends/moreinfo", {tmpFriend: foundTmpFriend});
    });
});


router.post("/friends/new/more_info/:tmpfriend_id", function(req, res) {
    TmpFriend.findById(req.params.tmpfriend_id, function(err, foundTmpFriend) {
        if (err) {
            return middle.error(req, res, err);
        }
        if (!req.body.description) {
            req.flash("error", "Please tell us about your new friend!");
            return res.redirect("back");
        }
        foundTmpFriend.description = req.body.description;
        if(!foundTmpFriend.shelter) {
            if (!req.body.shelter.email) {
                req.flash("error", "Please provide at least a contact email");
                return res.redirect("back");
            }
            Shelter.create(req.body.shelter, function(err, newShelter) {
                if (err) {
                    return middle.error(req, res, err);
                }
                foundTmpFriend.shelter = newShelter;
                foundTmpFriend.save();
            });
        }
        foundTmpFriend.save(function(err) {
            if(err) {
                return middle.error(req, res, err);
            }
            res.redirect("/friends/new/upload/" + foundTmpFriend._id);
        });   
    });
});



router.get("/friends/new/upload/:tmpfriend_id", function(req, res) {
    TmpFriend.findById(req.params.tmpfriend_id, function(err, foundFriend) {
        if(err){
            return middle.error(req, res, err);
        }
        res.render("friends/tmpupload", {tmpFriend: foundFriend});    
    });
});


router.post("/create/new/friend/:tmpfriend_id", upload.single("photo"), function(req, res) {
    var postLimit = 4;
    req.user.postStatus += 1;
    req.user.save();
    TmpFriend.findById(req.params.tmpfriend_id, function(err, foundFriend) {
        if(err) {
            return middle.error(req, res, err);
        }
        var friend = {
            name: foundFriend.name,
            url: foundFriend.url,
            breeds: foundFriend.breeds,
            lowerName: foundFriend.lowerName,
            human: foundFriend.human,
            description: foundFriend.description,
            sex: foundFriend.sex,
            age: foundFriend.age,
            size: foundFriend.size,
            mix: foundFriend.mix,
            animal: foundFriend.animal,
            shelterId: foundFriend.shelterId,
            shelterPetId: foundFriend.shelterPetId,
            shelter: foundFriend.shelter
        };
        Friend.create(friend, function(err, newFriend) {
            if(err) {
                return middle.error(req, res, err);
            }
            Human.findById(req.user._id, function(err, human) {
                if(err) {
                    return middle.error(req, res, err);
                }
                human.friends.unshift(newFriend);
                human.save();  
            });
            TmpFriend.findByIdAndRemove(foundFriend._id, function(err){
                if(err){return middle.error(req, res, err);}
                
            });
            if(req.file) {
                Image.create(req.file, function(err, newImage) {
                    if(err){
                        return middle.error(req, res, err);
                    }
                    if(req.user.postStatus >= postLimit) {
                        req.user.canPost = false;
                    }
                    setTimeout(function () {
                        req.user.postStatus = 0;
                        req.user.canPost = true;
                    }, 120000);
                    newImage.human.id = req.user;
                    newImage.friend = newFriend;
                    newImage.score = Math.floor((Math.random() * 100) + 950);
                    newImage.save();
                    newFriend.uploads.photos.unshift({id: newImage, url: newImage.url});
                    newFriend.save();
                    res.redirect("/" + newFriend.url);
                }); 
            } else {
                return middle.error(req, res);
            }
        });
    });
});



router.get("/:friend_url/:friend_id/upload", middle.checkFriendOwner, function(req, res) {
    Friend.findById(req.params.friend_id, function(err, foundFriend) {
        if(err){
            return middle.error(req, res, err);
        }
        res.render("friends/upload", {friend: foundFriend});    
    });
});


router.post("/:friend_url/:friend_id/upload", middle.checkFriendOwner, upload.single("photo"), function(req, res) {
    var postLimit = 4;
    req.user.postStatus += 1;
    req.user.save();
    // if(req.user.canPost) {
    Friend.findById(req.params.friend_id, function(err, foundFriend) {
        if(err) {
            return middle.error(req, res, err);
        }
        if(req.file) {
            Image.create(req.file, function(err, newImage) {
                if(err){
                    return middle.error(req, res, err);
                }
                if(req.user.postStatus >= postLimit) {
                    req.user.canPost = false;
                    req.user.save();
                }
                setTimeout(function () {
                    req.user.postStatus = 0;
                    req.user.canPost = true;
                    req.user.save();
                }, 120000);
                newImage.human.id = req.user;
                newImage.friend = foundFriend;
                newImage.score = Math.floor((Math.random() * 100) + 950);
                newImage.save();
                foundFriend.uploads.photos.splice(1, 0, {id: newImage, url: newImage.url});
                foundFriend.save();
                res.redirect("/" + req.params.friend_url);
            });    
        } else {
            return middle.error(req, res);
        }    
    });

});


                                                                            // SHOW

router.get("/:friend_url", function(req, res) {
    Friend.findOne({url: req.params.friend_url}).populate("uploads.photos.id").populate("shelter").exec(function(err, foundFriend) {
        if(err) {
            return middle.error(req, res, err);
        }
        if(foundFriend) {
            for(var i=0,len=foundFriend.uploads.photos.length;i<len;i++) {
                foundFriend.uploads.photos[i].id.score += 10;
                foundFriend.uploads.photos[i].id.save(); 
            }
            res.render("friends/show", {friend: foundFriend, path: "/:friend_url", slideshow: false});
        } else {
            req.flash("error", "Oops, there isn't anything there!");
            res.redirect("/");
        }       
    });
});

                                                                            // EDIT


                                                                              


                                                                            // DESTROY


router.get("/friends/:friend_id/delete", function(req, res) {
    Friend.findByIdAndRemove(req.params.friend_id).exec(function(err, removedFriend) {
        if(err) {
            req.flash("error", "An Error has occured");
            return res.redirect("/");
        }
        req.user.friends.forEach(function(friend, i) {
            if(friend.equals(removedFriend._id)) {
                req.user.friends.splice(i, 1);
                req.user.save();
            }
        });
        removedFriend.uploads.photos.forEach(function(image) {
            Image.findByIdAndRemove(image.id, function(err, removedImage) {
                cloudinary.v2.uploader.destroy(removedImage.public_id, function(err) {
                    if(err) {
                        return middle.error(req, res, err);
                    }
                });
            });
        });
        req.flash("success", removedFriend.name + " was removed from TC Friends");
        res.redirect("/");
    });
});


router.post("/delete/photo/:friend_id/:photo_id", function(req, res) {
    Friend.findById(req.params.friend_id).populate("uploads.photos.id").exec(function(err, foundFriend) {
        if (err) {
            return middle.error(req, res, err);
        }
        if(foundFriend.uploads.photos.length > 1) {
            foundFriend.uploads.photos.forEach(function(image, i) {
                if (image.id._id.equals(req.params.photo_id)) {
                    foundFriend.uploads.photos.splice(i, 1);
                    foundFriend.save();
                    Image.findByIdAndRemove(image.id._id, function(err, foundImage) {
                        if(err) {
                            return middle.error(req, res, err);
                        }
                        cloudinary.v2.uploader.destroy(foundImage.public_id, function(err) {
                            if(err) {
                                return middle.error(req, res, err);
                            }
                            res.redirect("/" + foundFriend.url);
                        });
                    });
                } 
            });
        } else {
            middle.error(req, res);
        }
    });

});





module.exports = router;



