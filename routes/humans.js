var express         = require("express"),
    router          = express.Router(),
    Human           = require("../models/human"),
    Image           = require("../models/image"),
    multer          = require("multer"),
    nodemailer      = require("nodemailer"),
    cloudinary      = require("cloudinary"),
    fs              = require("fs"),
    middle          = require("../middleware");




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        file.filename = file.fieldname + "-" + Date.now();
        switch (file.mimetype) {
            case "image/png" :
                file.filename += ".png";
                break;
            case "image/jpeg":
                file.filename += ".jpg";
                break;
            default:
                break;    
        }
        cb(null, file.filename);
    }
});


var upload          = multer({storage: storage});


    
    
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
    Human.findById(req.params.human_id, function(err, foundHuman) {
        if(err) {
            return middle.error(req, res, err);
        }
        cloudinary.v2.uploader.upload(req.file.path, function(err, newDp) {
            if(foundHuman.dp.url !== "/default_dp.png") {
                cloudinary.v2.uploader.destroy(foundHuman.dp.public_id, function(err) {
                    if(err) {
                        return middle.error(req, res, err);
                    }
                });
            }
            foundHuman.dp.url = newDp.url;
            foundHuman.dp.public_id = newDp.public_id;
            foundHuman.dp.format = newDp.format;
            foundHuman.dp.original_filename = newDp.original_filename;
            foundHuman.save();
            if(foundHuman.dp && foundHuman.dp.original_filename) {
                fs.unlinkSync("public/uploads/" + foundHuman.dp.original_filename + "." + foundHuman.dp.format);
            }
            res.redirect("/humans/" + req.params.human_id);
        });
    });
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