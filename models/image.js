var mongoose            = require("mongoose");



var ImageSchema = new mongoose.Schema({
    public_id: String,
    signature: String,
    width: Number,
    height: Number,
    format: String,
    created_at: String,
    tags: [],
    url: String,
    smallThumb: String,
    largeThumb: String,
    original_filename: String,
    score: Number,
    human: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Human"
        },
        name: String
    }, 
    friend: Object
});



ImageSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('Friend').remove({
        friend: {
            id: this._id
        }
    }, next);
});


module.exports = mongoose.model("Image", ImageSchema);


