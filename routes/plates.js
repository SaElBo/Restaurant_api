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

const router = express.Router({mergeParams:true});

router.route('/')
.get(advanceResults(Plate),getPlate)
.post(addPlate);

router.route('/:id').get(getSingelePlate).put(updatePlate).delete(deletePlate);


module.exports = router;