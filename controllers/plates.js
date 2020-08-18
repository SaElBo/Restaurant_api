const ErrorResponse = require('../utils/errorResponse');
const Plate = require('../models/Plate');
const Restaurant = require('../models/Restaurant');
const asyncHandler = require('../middleware/async');


//@desc        Get all plate
//@route       GET api/v1/plate
//@route       GET  api/v1/restaurant/:restaurantId/plate
//@acess       Public
exports.getPlate = asyncHandler(async (req, res, next) => {
   

    if (req.params.restaurantId) {
      const plates = await Plate.find({ restaurant: req.params.restaurantId });
      return res.status(200).json(
          {
              success: true,
              count: plates.length,
              data: plates
          }
      );
    } else {
       res.status(200).json(res.advanceResults);
    }

   
});

//@desc        Get single plate
//@route       GET api/v1/plate/:id
//@acess       Public
exports.getSingelePlate = asyncHandler(async (req, res, next) => {

    const plate = await Plate.findById(req.params.id).populate('restaurant', 'name description');

    if (!plate) {
        return next(new ErrorResponse('No plate with this id', 404));
    }
    res.status(200).json({
        success: true,
        data: plate
    })
});

//@desc        add plate
//@route       POST api/v1/restaurant/:restaurantId/plate
//@acess       Private
exports.addPlate = asyncHandler(async (req, res, next) => {

    req.body.restaurant = req.params.restaurantId

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
        return next(new ErrorResponse(`No restaurant with the id : ${req.params.restaurantId}`, 404));
    }

    const plate = await Plate.create(req.body);

    res.status(200).json({
        success: true,
        data: plate
    })
});


//@desc        Update single plate
//@route       PUT api/v1/plate/:id
//@acess       Private
exports.updatePlate = asyncHandler(async (req, res, next) => {

   
    let plate = await Plate.findById(req.params.id);

    if (!plate) {
        return next(new ErrorResponse(`Plate not found with the id of ${id}`, 404));
    }

    plate = await Plate.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators:true, useFindAndModify:false});

    res.status(200).json({
        success: true,
        data: plate
    })
});

//@desc        Update single plate
//@route       DELETE api/v1/plate/:id
//@acess       Private
exports.deletePlate = asyncHandler(async (req, res, next) => {

   
    let plate = await Plate.findById(req.params.id);

    if (!plate) {
        return next(new ErrorResponse(`Plate not found with the id of ${id}`, 404));
    }

    await plate.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});