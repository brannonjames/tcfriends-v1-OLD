var mongoose        = require("mongoose");


var shelterSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    county: String,
    longitude: String,
    latitude: String
});


module.exports = mongoose.model("Shelter", shelterSchema);