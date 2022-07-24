const mongoose = require('mongoose');
const Review = require('./review');

const kayakSpotSchema = new mongoose.Schema({
    title: String,
    location: String,
    image: String,
    description: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

kayakSpotSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('KayakSpot', kayakSpotSchema)


