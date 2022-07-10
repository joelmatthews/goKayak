const mongoose = require('mongoose');
const KayakSpot = require('../models/kayakSpot')
const cities = require('./cityseeds');
const {places, descriptors} = require('./seedhelpers');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/go-kayak');
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await KayakSpot.deleteMany({});
    const k = new KayakSpot({title: 'Lake Gulina'});
    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const kayak = new KayakSpot({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis odit natus voluptatibus culpa ut, earum deleniti quidem facilis cupiditate sit dignissimos tempora quo ab impedit voluptatum placeat dolorem nisi labore.'
        });
        await kayak.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
