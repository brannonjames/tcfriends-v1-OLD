var mongoose        = require("mongoose");



var FriendSchema = new mongoose.Schema({
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
                    path: String
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



FriendSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    // this.model('Image').remove({ human: { id:  }}, next);
});


module.exports = mongoose.model("TmpFriend", FriendSchema);
    