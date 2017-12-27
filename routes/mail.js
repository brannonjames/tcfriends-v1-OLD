var express     = require("express"),
    router      = express.Router(),
    nodemailer  = require("nodemailer"),
    Human       = require("../models/human"),
    middle      = require("../middleware"),
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
    
    
module.exports = router;