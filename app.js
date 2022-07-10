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

app.use(express.urlencoded({extended: true}));

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

app.get('/kayaking/new', (req, res) => {
    res.render('new');
})

app.post('/kayaking', async (req, res) => {
    const newKayakSpot = new KayakSpot(req.body.kayak);
    await newKayakSpot.save();
    res.redirect(`/kayaking/${newKayakSpot._id}`)
})

app.get('/kayaking/:id', async (req, res) => {
    const { id } = req.params;
    const kayak = await KayakSpot.findById(id);
    res.render('show', { kayak });
})

app.get('/kayaking/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundKayakSpot = await KayakSpot.findById(id);
    res.render('edit', { foundKayakSpot });
})



app.listen(3000, () => {
    console.log('Listening on port 3000')
})