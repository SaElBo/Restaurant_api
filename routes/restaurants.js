const express = require('express');
const {
    getRestaurants,
    getSingleRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsInRadius
} = require('../controllers/restaurants');

//Include other resource router
const plateRouter = require('./plates');

const router = express.Router();

//Re-route into other resouce routers
router.use('/:restaurantId/plates', plateRouter);

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