const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const ErrorResponde = require('../utils/errorResponse');

const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

//@desc        Get all restaurant
//@route       GET api/v1/restaurants
//@acess        Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {

    const allRestaurants = await Restaurant.find({});
    res.status(200).json({ success: true, count: allRestaurants.length, data: allRestaurants });

});

// @desc        Get single restaurant
// @route       GET api/v1/restaurants/:id
//@acess        Public
exports.getSingleRestaurant = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    console.log(id);

    const singleRestaurant = await Restaurant.findById(id);

    if (!singleRestaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }

    res.status(200).json({ success: true, data: singleRestaurant });

});


// @desc        Create new restaurant
// @route       POST api/v1/restaurants
//@acess        Private
exports.createRestaurant = asyncHandler(async (req, res, next) => {

    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });

})

// @desc        update  restaurant
// @route       PUT api/v1/restaurant/:id
//@acess        Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const data = req.body


    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true });

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }

    res.status(200).json({ success: true, data: updatedRestaurant });

});

// @desc        delete all restaurant
// @route       DELETE api/v1/restaurant/:id
//@acess        Public
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {

    const id = req.params.id

    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });

});


// @desc        get restaurant within a radius
// @route       DELETE api/v1/restaurant/radius/:zipcode/:distance
//@acess        Public
exports.getRestaurantsInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, country, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);

    //find the right loc based on the contry code
     const rightLoc = loc.filter(el => el.countryCode === country);

    //extract lat & lng from rightLoc
    const lat = rightLoc[0].latitude;
    const lng = rightLoc[0].longitude;

    console.log(rightLoc, lat, lng);

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 6378;

    const restaurant = await Restaurant.find({
        location: { $geoWithin: { $centerSphere: [[lat ,lng], radius] } }
    });




    res.status(200).json({
        success: true,
        count: restaurant.length,
        data: restaurant
    });

});