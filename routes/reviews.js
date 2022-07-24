const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const KayakSpot = require('../models/kayakSpot');
const Review = require('../models/review');
const { reviewSchema } = require('../joiSchemas.js');
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const kayak = await KayakSpot.findById(id);
    const review = await new Review(req.body.review);
    kayak.reviews.push(review);
    await review.save();
    await kayak.save();
    res.redirect(`/kayaking/${kayak._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await KayakSpot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/kayaking/${id}`);
}))

module.exports = router;