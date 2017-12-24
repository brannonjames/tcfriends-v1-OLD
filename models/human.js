var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");
    
    
    
var HumanSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    zip: Number,
    city: String,
    photos: [ {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Image"
        } }   
    ],
    canPost: Boolean,
    postStatus: Number,
    company: {
        content: String,
        show: String
    },
    phone: {
        content: String,
        show: String
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friend"
        }    
    ],
    dp: {
        url: String,
        public_id: String,
        original_filename: String,
        format: String
    }    
});


HumanSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Human", HumanSchema);