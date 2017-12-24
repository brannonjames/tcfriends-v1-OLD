var express         = require("express"),
    router          = express.Router(),
    Human           = require("../models/human"),
    Image           = require("../models/image"),
    middle          = require("../middleware"),
    multer          = require("multer");
    
 
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
    
var upload = multer({storage: storage});  
 
 
 
 
// const Promise = require('bluebird');

router.post("/users/:user/photos/upload", middle.isLoggedIn, upload.array("photos", 4), function(req, res, next) {
    req.files.forEach(function(file) {
        // return console.log(file);
        Image.create(file, function(err, image) {
            if(err){return console.log(err.message)}
            Human.findById(req.params.user, function(err, human) {
                if(err){return console.log(err.message)}
                human.photos.unshift({id: image, path: image.path});
                human.save();
            });
        });
    });
});

 
    
module.exports = router;