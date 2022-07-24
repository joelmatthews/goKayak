const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const KayakSpot = require('../models/kayakSpot');
const { kayakSchema } = require('../joiSchemas.js');
const router = express.Router();

const validateKayak = (req, res, next) => {
    const { error } = kayakSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const kayaking = await KayakSpot.find({});
    res.render('index', { kayaking });
}))

router.get('/new', (req, res) => {
    res.render('new');
})

router.post('/', validateKayak, catchAsync(async (req, res) => {
    const newKayakSpot = new KayakSpot(req.body.kayak);
    await newKayakSpot.save();
    res.redirect(`/kayaking/${newKayakSpot._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const kayak = await (await KayakSpot.findById(id)).populate('reviews');
    res.render('show', { kayak });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundKayakSpot = await KayakSpot.findById(id);
    res.render('edit', { foundKayakSpot });
}))

router.put('/:id', validateKayak, catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedKayak = await KayakSpot.findByIdAndUpdate(id, { ...req.body.kayak });
    res.redirect(`/kayaking/${updatedKayak._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedKayak = await KayakSpot.findByIdAndDelete(id);
    res.redirect('/kayaking')
}))

module.exports = router;