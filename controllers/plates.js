const ErrorResponse = require('../utils/errorResponse');
const Plate = require('../models/Plate');
const asyncHandler = require('../middleware/async');


//@desc        Get all plate
//@route       GET api/v1/plate
//@route       GET  api/v1/restaurant/:restaurantId/plate
//@acess       Public
exports.getPlate = asyncHandler(async (req,res,next)=>{
    let query;

    if(req.params.restaurantId){
        query = Plate.find({restaurant : req.params.restaurantId});
    }else{
        query = Plate.find().populate('restaurant','name description');
    }

    const plates = await query;
    

    res.status(200).json({
        success: true,
        count: plates.length,
        data: plates
    })
});