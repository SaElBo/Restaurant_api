const express = require('express');
const {
    getRestaurants,
    getSingleRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsInRadius,
    restaurantUploadPhoto
} = require('../controllers/restaurants');

const Restaurant = require('../models/Restaurant');
const advanceResults = require('../middleware/advanceResults');

//Include other resource router
const plateRouter = require('./plates');

const router = express.Router();

//Re-route into other resouce routers
router.use('/:restaurantId/plates', plateRouter);

router.route('/radius/:zipcode/:country/:distance').get(getRestaurantsInRadius);

router.route('/:id/photo').put(restaurantUploadPhoto);
//
router.route('/')
.get(advanceResults(Restaurant, 'menu'),getRestaurants)
.post(createRestaurant)

router.route('/:id')
.get(getSingleRestaurant)
.put(updateRestaurant)
.delete(deleteRestaurant)





module.exports = router;