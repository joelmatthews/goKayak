const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const KayakSpot = require('./models/kayakSpot');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/go-kayak');
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/kayaking', async (req, res) => {
    const kayaking = await KayakSpot.find({});
    console.log(kayaking)
    res.render('index', { kayaking });
})

app.get('/kayaking/:id', async (req, res) => {
    const { id } = req.params;
    const kayak = await KayakSpot.findById(id);
    res.send(kayak)
})



app.listen(3000, () => {
    console.log('Listening on port 3000')
})