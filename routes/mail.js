var express     = require("express"),
    router      = express.Router(),
    Human       = require("../models/human"),
    middle      = require("../middleware"),
    crypto      = require("crypto"),
    ejs         = require("ejs"),
    mailgun     = require('mailgun-js')({apiKey: process.env.mailgunKey, domain: "twincityfriends.com"});
    
 

    





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
            middle.error(req, res, err);
        }
        if(req.params.subject === "message") {
            ejs.renderFile("templates/emails/user_email.ejs", {recipient: foundRecipient, message: req.body.mail.html}, function(err, template){
                if(err){
                    console.log(err);
                }
                console.log(template);
                var data = {
                    from: "email@twincityfriends.com",
                    to: foundRecipient.username,
                    subject: "New Message | TC Friends",
                    html: template
                };
     
                mailgun.messages().send(data, function (err, body) {
                  console.log(body);
                  req.flash("success", "Your message was sent");
                  res.redirect("/feed/1");
                });
            });  
        }   
        else if(req.params.subject === "report") {
            if(!req.body.mail.html) {
                req.flash("error", "You must give a reason for reporting");
                res.redirect("back");
            } else {
                ejs.renderFile("templates/emails/report_email.ejs", {sender: req.user, reported: foundRecipient, message: req.body.mail.html}, function(err, template){
                    if(err){
                        console.log(err);
                    }
                    console.log(template);
                    var data = {
                        from: 'support@twincityfriends.com',
                        to: "support@twincityfriends.com",
                        subject: 'Reported User',
                        text: "text",
                        html: template
                    };
         
                    mailgun.messages().send(data, function (err, body) {
                      console.log(body);
                      req.flash("success", "User Reported");
                      res.redirect("/feed/1");
                    });
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
            req.flash("success", "Reset instructions sent to " + req.body.email);
            return res.redirect("/feed/1");
        }
        crypto.randomBytes(20, function(err, buffer){
            var token = buffer.toString("hex");
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 3600000;
            user.save(function(){
                ejs.renderFile("templates/emails/password_reset.ejs", {resetUrl: req.headers.origin + "/resetpassword/" + token}, function(err, template){
                    if(err){
                        console.log(err);
                    }
                    console.log(template);
                    var data = {
                        from: 'jimmy@twincityfriends.com',
                        to: req.body.email,
                        subject: 'Test',
                        text: "text",
                        html: template
                    };
         
                    mailgun.messages().send(data, function (err, body) {
                      console.log(body);
                      req.flash("success", "Reset instructions sent to " + req.body.email);
                      res.redirect("/feed/1");
                    });
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