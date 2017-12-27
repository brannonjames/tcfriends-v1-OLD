require('dotenv').config();

var express             = require("express"),
    app                 = express(),
    indexRoutes         =require("./routes"),
    humanRoutes         = require("./routes/humans"),
    friendRoutes        = require("./routes/friends"),
    mailRoutes          = require("./routes/mail"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    Human               = require("./models/human"),
    flash               = require("connect-flash"),
    cloudinary          = require("cloudinary"),
    dbFunc               = require("./seed");


mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/tcfriends_v1", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(flash());


dbFunc.seedBreed(false);
dbFunc.seedShelter(true);
dbFunc.resetHuman(false);
dbFunc.resetFriend(false);
dbFunc.resetImage(false);
dbFunc.resetTmpFriend(true);



app.use(require("express-session")({
    secret: "damn baby",
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Human.authenticate()));
passport.serializeUser(Human.serializeUser());
passport.deserializeUser(Human.deserializeUser());



app.use(function(req, res, next) {
    res.locals.path = req.originalUrl;
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.title = "TC Friends";
    next();
});


app.use(mailRoutes);
app.use(indexRoutes);
app.use(humanRoutes);
app.use(friendRoutes);




app.listen(process.env.PORT || 3000, function(){
    console.log("server is running");
});    
    