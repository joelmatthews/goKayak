const express = require('express');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ExpressError = require('./utilities/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');


const kayaking = require('./routes/kayaking')
const reviews = require('./routes/reviews')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/go-kayak');
}

const app = express();

const sessionOptions = {
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true,
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use('/kayaking', kayaking)
app.use('/kayaking/:id/reviews', reviews)




app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Oh no, page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})