const express = require('express');
const {
    getRestaurants,
    getSingleRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsInRadius
} = require('../controllers/restaurants');

const router = express.Router();
router.route('/radius/:zipcode/:country/:distance').get(getRestaurantsInRadius);

//
router.route('/')
.get(getRestaurants)
.post(createRestaurant)

router.route('/:id')
.get(getSingleRestaurant)
.put(updateRestaurant)
.delete(deleteRestaurant)





module.exports = router;