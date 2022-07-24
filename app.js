const express = require('express');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const KayakSpot = require('./models/kayakSpot');
const Review = require('./models/review');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const ejsMate = require('ejs-mate');
const { kayakSchema, reviewSchema } = require('./joiSchemas.js');

const kayaking = require('./routes/kayaking')
const reviews = require('./routes/reviews')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/go-kayak');
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use('/kayaking', kayaking)
app.use('/kayaking/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.render('home');
})

// app.post('/kayaking/:id/reviews', validateReview, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const kayak = await KayakSpot.findById(id);
//     const review = await new Review(req.body.review);
//     kayak.reviews.push(review);
//     await review.save();
//     await kayak.save();
//     res.redirect(`/kayaking/${kayak._id}`)
// }))

// app.delete('/kayaking/:id/reviews/:reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await KayakSpot.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/kayaking/${id}`);
// }))

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