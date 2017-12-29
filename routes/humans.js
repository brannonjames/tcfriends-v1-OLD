var express         = require("express"),
    router          = express.Router(),
    Human           = require("../models/human"),
    multer          = require("multer"),
    cloudinary      = require("cloudinary"),
    cloudStorage    = require('multer-storage-cloudinary'),
    middle          = require("../middleware");




var storage = cloudStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    transformation: {
        height: 700,
        width: 700,
        crop: "limit",
        secure: true,
        quality: 88
    },
    filename: function (req, file, cb) {
        cb(null, file.filename);
    }
});
 
var upload = multer({ storage: storage });


                                                                                // INDEX 
    
router.get("/humans", function(req, res) {
    Human.find({}, function(err, foundHumans) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/index", {humans: foundHumans});
    });
});



router.get("/humans/:human_id/friends", function(req, res) {
    Human.findById(req.params.human_id).populate("friends").exec(function(err, foundHuman) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/friends", {human: foundHuman});
    });
});




                                                                          // NEW


router.get("/humans/:human_id/new_dp", middle.checkHumanOwner, function(req, res) {
    Human.findById(req.params.human_id, function(err, foundHuman) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/new_dp", {human: foundHuman});
    });
});


router.post("/humans/:human_id/new_dp", middle.checkHumanOwner, upload.single("dp"), function(req, res) {
    if(req.file) {
        Human.findById(req.params.human_id, function(err, foundHuman) {
            if(err) {
                return middle.error(req, res, err);
            }
            if(foundHuman.dp.url !== "/default_dp.png") {
                cloudinary.v2.uploader.destroy(foundHuman.dp.public_id, function(err) {
                    if(err) {
                        return middle.error(req, res, err);
                    }
                });
            }
            foundHuman.dp = {
                url: req.file.url,
                public_id: req.file.public_id
            }
            foundHuman.save(function() { 
                res.redirect("/humans/" + req.params.human_id);
            });
        });
    } else {
        middle.error(req, res);
    }
});


                                                                                // SHOW





router.get("/humans/:human_id", function(req, res) {
    Human.findById(req.params.human_id).populate("friends").exec(function(err, foundHuman) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/profile", {human: foundHuman});
    });
   
});

      



module.exports = router;