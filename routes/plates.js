const express = require('express');
const {
    getPlate, getSingelePlate, updatePlate, addPlate, deletePlate
    } = require('../controllers/plates');

const router = express.Router({mergeParams:true});

router.route('/').get(getPlate).post(addPlate);

router.route('/:id').get(getSingelePlate).put(updatePlate).delete(deletePlate);


module.exports = router;