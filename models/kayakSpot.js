const mongoose = require('mongoose');

const kayakSpotSchema = new mongoose.Schema({
    title: String,
    location: String,
    image: String,
    description: String,
})

module.exports = mongoose.model('KayakSpot', kayakSpotSchema)