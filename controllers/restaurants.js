const path = require('path');
const geocoder = require('../utils/geocoder');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const Restaurant = require('../models/Restaurant');
//@desc        Get all restaurant
//@route       GET api/v1/restaurants
//@acess        Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {

   

    //Return response
    res.status(200).json(res.advanceResults);

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

    //Add user to req.body
    req.body.user = req.user.id;


    const publishedRestaurant = await Restaurant.findOne({user: req.user.id});

    if(publishedRestaurant && req.user.role !== 'admin'){
        return next( new ErrorResponse(`User with id : ${req.user.id} has already published a restaurant, contact an admin for more informations`),400);
    }
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({ success: true, data: restaurant });

})

// @desc        update  restaurant
// @route       PUT api/v1/restaurant/:id
//@acess        Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {

    const id = req.params.id
    const data = req.body


    let restaurant = await Restaurant.findById(id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }

    //Make sure user is restauran owner
    if(restaurant.user.toString() !== req.user.id && req.user.id !== 'admin'){
        return next(new ErrorResponse('User non authorazied to update this restaurant',401))
    }

    restaurant = await Restaurant.findByIdAndUpdate(id,data, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: restaurant });

});

// @desc        delete all restaurant
// @route       DELETE api/v1/restaurant/:id
//@acess        Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {

    const id = req.params.id

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }

    //Make sure user is restauran owner
    if(restaurant.user.toString() !== req.user.id && req.user.id !== 'admin'){
        return next(new ErrorResponse('User non authorazied to delete this restaurant',401))
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


// @desc        Upload foto
// @route       PUT api/v1/restaurant/:id/photo
//@acess        Private
exports.restaurantUploadPhoto = asyncHandler(async (req, res, next) => {

    const id = req.params.id

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with the id of ${id}`, 404));
    }

    //Make sure user is restauran owner
    if(restaurant.user.toString() !== req.user.id && req.user.id !== 'admin'){
        return next(new ErrorResponse('User non authorazied to update this restaurant',401))
    }

    //Check if there is a file
    if (!req.files) {
        return next(new ErrorResponse(`Please insert a photo`, 400));
    }

    const file = req.files.file;
    //check if the file is an image
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please insert a  valid photo`, 400));
    }

    //Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please insert a photo lass than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    //Create costum file nam e
    file.name = `photo_${restaurant._id}.${path.parse(file.name).ext}`;
   
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));

        }

        await Restaurant.findByIdAndUpdate(id,{photo: file.name},{useFindAndModify: false});

        res.status(200).json({
            success: true,
            data: file.name
        })
    });

    
});