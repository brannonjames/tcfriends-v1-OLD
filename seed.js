var Breed       = require("./models/breed"),
    Friend      = require("./models/friend"),
    Human      = require("./models/human"),
    Image      = require("./models/image"),
    Shelter     = require("./models/shelter"),
    TmpFriend  = require("./models/tmpfriend"),
    petfinder   = require("petfinder")("37a7e429557d82083bea50a3525de2c9", "3ef5471d7cded3a0201f001f83d46a5f");

// var animals = ["dog", "cat", "bird", "reptile", "smallfurry", "horse", "barnyard"];
var animals = ["barnyard", "horse", "smallfurry", "reptile", "bird", "cat", "dog"];

module.exports = {


    
    seedBreed: function(seed) {
        if(seed) {
            Breed.remove({}, function(err) {
                if(err){return console.log(err.message)}
                animals.forEach(function(animal) {
                    petfinder.getBreedList(animal, function(err, breedList) {
                        if(err){return console.log(err.message)}
                        Breed.create({animal: animal, breeds: breedList}, function(err, animalBreeds) {
                            if(err){return console.log(err.message)}
                            console.log(animalBreeds);
                        });
                    });
                });
            });
        }
    },
    
    
    seedShelter: function(seed) {
        if(seed) {
            Shelter.remove({}, function(err) {
                if(err){return console.log(err.message)}
                petfinder.findShelter("Minneapolis, MN", {count: 340}, function(err, shelters) {
                    if(err){return console.log(err.message)}
                    shelters.forEach(function(shelter) {
                        Shelter.create(shelter, function(err, newShelter) {
                            if(err){return console.log(err.message)}
                        });
                    });
                });
            });
        }
    },
    
    
    resetFriend: function(reset) {
        if(reset) {
            Friend.remove({}, function(err) {
                if(err){return console.log(err.message)}
            });
            Human.find({}, function(err, humans) {
                if(err){return console.log(err)}
                humans.forEach(function(human) {
                    human.friends = [];
                    human.save();
                });
            });
        }
    },
    
    
    resetTmpFriend: function(reset) {
        if(reset) {
            TmpFriend.remove({}, function(err) {
                if(err){return console.log(err.message)}
            });
        }
    },
    
    resetHuman: function(reset) {
        if(reset) {
            Human.remove({}, function(err) {
                if(err){return console.log(err.message)}
            });
        }
    },
    
    resetImage: function(reset) {
        if(reset) {
            Image.remove({}, function(err) {
                if(err){return console.log(err.message)}
            });
        }
    },


};

