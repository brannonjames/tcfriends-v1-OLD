var mongoose        = require("mongoose");



var FriendSchema = new mongoose.Schema({
    // _id: Number,
    name: String,
    lowerName: String,
    description: String,
    sex: String,
    age: String,
    size: String,
    mix: String,
    animal: String,
    shelterId: String,
    shelterPetId: String,
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shelter"
    },  
    contact: Object,
    breeds: [],
    url: String,
    uploads: {
            photos: [
                {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Image"
                    },
                    url: String
                }
            ],
            videos: []
    },
    human: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Human"
        },
        name: String
    },
});






module.exports = mongoose.model("Friend", FriendSchema);
    
    