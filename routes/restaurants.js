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

const {protect, authorize}= require('../middleware/auth');

//Re-route into other resouce routers
router.use('/:restaurantId/plates', plateRouter);

router.route('/radius/:zipcode/:country/:distance').get(getRestaurantsInRadius);

router.route('/:id/photo').put(protect,authorize('publisher','admin'), restaurantUploadPhoto);
//
router.route('/')
.get(advanceResults(Restaurant, 'menu user'),getRestaurants)

//TODO: remove user from populate, it's only for test purpose

.post(protect,authorize('publisher','admin'), createRestaurant)

router.route('/:id')
.get(getSingleRestaurant)
.put(protect,authorize('publisher','admin'), updateRestaurant)
.delete(protect,authorize('publisher','admin'), deleteRestaurant)





module.exports = router;