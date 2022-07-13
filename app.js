const express = require('express');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const KayakSpot = require('./models/kayakSpot');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require ('./utilities/catchAsync');
const ejsMate = require('ejs-mate');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/go-kayak');
}

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/kayaking', catchAsync(async (req, res) => {
    const kayaking = await KayakSpot.find({});
    res.render('index', { kayaking });
}))

app.get('/kayaking/new', (req, res) => {
    res.render('new');
})

app.post('/kayaking', catchAsync(async (req, res) => {
    const newKayakSpot = new KayakSpot(req.body.kayak);
    await newKayakSpot.save();
    res.redirect(`/kayaking/${newKayakSpot._id}`)
}))

app.get('/kayaking/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const kayak = await KayakSpot.findById(id);
    res.render('show', { kayak });
}))

app.get('/kayaking/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundKayakSpot = await KayakSpot.findById(id);
    res.render('edit', { foundKayakSpot });
}))

app.put('/kayaking/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedKayak = await KayakSpot.findByIdAndUpdate(id, { ...req.body.kayak });
    res.redirect(`/kayaking/${updatedKayak._id}`)
}))

app.delete('/kayaking/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedKayak = await KayakSpot.findByIdAndDelete(id);
    res.redirect('/kayaking')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Oh no, page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})