const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');

const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

//@desc        Get all restaurant
//@route       GET api/v1/restaurants
//@acess        Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {

    let query;

    // Copy of req.query
    const reqQuery = { ...req.query };

    //Field to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //Loop over removeFields and delete them from reqQuerry
    removeFields.forEach(param => delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create mongoose operators ($gt,$gte ecc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = Restaurant.find(JSON.parse(queryStr));
    query = query.populate('menu');
    

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort field
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
        
    }else{
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Restaurant.countDocuments();


    query = query.skip(startIndex).limit(limit);

    //Executing querry
    const allRestaurants = await query;

    //Pagination result
    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit
        }
     }

     if(startIndex > 0){
         pagination.prev = {
             page: page - 1,
             limit
         }
     }


    //Return response
    res.status(200).json({ success: true, count: allRestaurants.length,pagination, data: allRestaurants });

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

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }

    restaurant.remove();
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
        location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } }
    });




    res.status(200).json({
        success: true,
        count: restaurant.length,
        data: restaurant
    });

});