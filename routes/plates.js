const express = require('express');
const {
    getPlate,
    getSingelePlate,
    updatePlate,
    addPlate,
    deletePlate
} = require('../controllers/plates');

const Plate = require('../models/Plate');
const advanceResults = require('../middleware/advanceResults')

const router = express.Router({ mergeParams: true });

const { protect , authorize } = require('../middleware/auth');

router.route('/')
    .get(advanceResults(Plate, { path: 'restaurant', select: 'name description' }), getPlate)
    .post(protect,authorize('publisher','admin'), addPlate);

router.route('/:id')
    .get(getSingelePlate)
    .put(protect,authorize('publisher','admin'),updatePlate)
    .delete(protect,authorize('publisher','admin'), deletePlate);


module.exports = router;