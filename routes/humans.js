var express         = require("express"),
    router          = express.Router(),
    Human           = require("../models/human"),
    Image           = require("../models/image"),
    multer          = require("multer"),
    nodemailer      = require("nodemailer"),
    cloudinary      = require("cloudinary"),
    cloudStorage    = require('multer-storage-cloudinary'),
    fs              = require("fs"),
    middle          = require("../middleware");




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


    
    
router.get("/humans", function(req, res) {
    Human.find({}, function(err, foundHumans) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/index", {humans: foundHumans});
    });
});


router.get("/humans/:human_id", function(req, res) {
    Human.findById(req.params.human_id).populate("friends").exec(function(err, foundHuman) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/profile", {human: foundHuman});
    });
   
});


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



router.get("/humans/:human_id/friends", function(req, res) {
    Human.findById(req.params.human_id).populate("friends").exec(function(err, foundHuman) {
        if(err) {
            return middle.error(req, res, err);
        }
        res.render("humans/friends", {human: foundHuman});
    });
})






module.exports = router;