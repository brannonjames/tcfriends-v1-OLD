var mongoose        = require("mongoose");


var breedSchema = new mongoose.Schema({
    animal: String,
    breeds: []
});



module.exports = mongoose.model("Breed", breedSchema);