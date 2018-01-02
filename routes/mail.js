var express     = require("express"),
    router      = express.Router(),
    nodemailer  = require("nodemailer"),
    Human       = require("../models/human"),
    middle      = require("../middleware"),
    crypto      = require("crypto"),
    hbs         = require("nodemailer-express-handlebars");
    
 

    
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.mailUser,
        pass: process.env.mailPass
    }
});


transporter.use("compile", hbs({
    viewPath: "templates/emails",
    extName: ".hbs"
}));





router.get("/mail/:recipient_id/:subject", middle.isLoggedIn, function(req, res) {
    Human.findById(req.params.recipient_id, function(err, foundRecipient) {
        if(err) {
            return middle.error(req, res, err);
        }
        if(req.params.subject === "message" || req.params.subject === "report") {
            res.render("email", {recipient: foundRecipient, subject: req.params.subject});
        } else {
            res.redirect("/humans" + foundRecipient._id)
        }
    })
})



router.post("/mail/:recipient_id/:subject", middle.isLoggedIn, function(req, res) {
    var mailOptions = new Object();
    Human.findById(req.params.recipient_id, function(err, foundRecipient) {
        if(err) {
            return middle.error(req, res, err);
            req.flash("error", "An error has occured");
            res.redirect("back");
        }
        if(req.params.subject === "message") {
            mailOptions = {
                from: "msppets@gmail.com",
                to: foundRecipient.username,
                subject: "New message from " + req.user.firstName + " | Twin City Friends",
                template: "user_email",
                context: {
                    sender: req.user,
                    recipient: foundRecipient,
                    message: req.body.mail.html
                }
            };
            transporter.sendMail(mailOptions, function(err, info) {
                if(err){
                    return middle.error(req, res, err);
                }
                req.flash("success", "Message Sent");
                res.redirect("/humans/" + foundRecipient._id);
                console.log("Email sent: " + info.response);
            });    
        }   
        else if(req.params.subject === "report") {
            if(!req.body.mail.html) {
                req.flash("error", "You must give a reason for reporting");
                res.redirect("back");
            } else {
                mailOptions = {
                    from: "msppets@gmail.com",
                    to: "msppets@gmail.com",
                    subject: "User Reported",
                    template: "report_email",
                    context: {
                        sender: req.user,
                        reported: foundRecipient,
                        message: req.body.mail.html
                    }
                };
                transporter.sendMail(mailOptions, function(err, info) {
                    if(err){
                        return middle.error(req, res, err);
                    }
                    req.flash("success", "User Reported");
                    res.redirect("/humans/" + foundRecipient._id);
                    console.log("Email sent: " + info.response);
                });
            }   
        } else {
            res.redirect("/");
        } 
    });       
});




router.get("/forgotpassword", function(req, res){
    res.render("forgotpassword");
})


router.post("/forgotpassword", function(req, res){
    Human.findOne({username: req.body.email}, function(err, user){
        if(err){
            return console.log(err);
        }
        if(!user){
            console.log("No user with that email");
            return res.redirect("back");
        }
        crypto.randomBytes(20, function(err, buffer){
            var token = buffer.toString("hex");
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 3600000;
            user.save(function(){
                mailOptions = {
                    from: "msppets@gmail.com",
                    to: req.body.email,
                    subject: "Password Reset | Twin City Friends",
                    template: "password_reset",
                    context: {
                        resetUrl: req.headers.origin + "/resetpassword/" + token,
                    }
                };
                transporter.sendMail(mailOptions, function(err, info) {
                    if(err){
                        return middle.error(req, res, err);
                    }
                    req.flash("success", "Instructions sent to " + user.username);
                    res.redirect("/feed/1");
                    console.log("Email sent: " + info.response);
                });
            });
        });      
    });
});


router.get('/resetpassword/:token', function(req, res){
    Human.findOne({passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() }}, function(err, user){
        if(err){
            return console.log(err);
        }
        if(!user){
            return console.log("no user");
        }
        res.render("resetpassword", { token: user.passwordResetToken });
    });
});




router.post("/resetpassword/:token", function(req, res){
    Human.findOne({passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() }}, function(err, user){
        if(err){
            return console.log(err);
        }
        if(!user){
            
        }
        if(!req.body.password || req.body.password !== req.body.passwordConfirm){
            req.flash("error", "Passwords do not match");
            return res.redirect("back");
        }
        user.setPassword(req.body.password, function(){
            user.save(function(err){
                if(err){
                    return console.log(err);
                }
                req.flash("success", "Password successfully reset!");
                res.redirect("/login");
            });    
        });
    });
});
    
    
module.exports = router;