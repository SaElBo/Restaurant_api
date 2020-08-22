const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');


//@desc        Get all reviews
//@route       GET api/v1/reviews
//@route       GET  api/v1/restaurant/:restaurantId/reviews
//@acess       Public
exports.getReviews = asyncHandler(async (req, res, next) => {


    if (req.params.restaurantId) {
        const reviews = await Review.find({ restaurant: req.params.restaurantId });
        return res.status(200).json(
            {
                success: true,
                count: reviews.length,
                data: reviews
            }
        );
    } else {
        res.status(200).json(res.advanceResults);
    }
});


//@desc        Get single reviews
//@route       GET api/v1/reviews/:id
//@acess       Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await +Review.findById(req.params.id)
        .populate('restaurant', 'name description');
    
    if(!review){
        return next(new ErrorResponse('No review whit this id',404));
    }

    res.status(200).json({
        success: true,
        data: review
    })
});


//@desc        add  review
//@route       POST api/v1/restaurant/:restauranId/reviews
//@acess       Private
exports.addReview = asyncHandler(async (req, res, next) => {
    //Add user and the restaurant  to req.body
    req.body.user = req.user.id;
    req.body.restaurant = req.params.restaurantId;


   
    const restaurant  = await Restaurant.findById(req.params.restaurantId);
 
    if(!restaurant){
        return next( new ErrorResponse(`No restaurant with this id`),404);
    }
  
    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
});

//@desc        Update  review
//@route       PUT api/v1/reviews/:id
//@acess       Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    
    const id = req.params.id;
   
    let review  = await Review.findById(id);
 
    console.log(id)
    if(!review){
        return next( new ErrorResponse(`No review with this id`),404);
    }

    //Make sure reviews belong to user or user is an admin

    if(review.user.toString() !== req.user.id && req.user.role!== 'admin'){
        return next(new ErrorResponse('Not authorized to access this route',401))
    }
  
     review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({ success: true, data: review });
});


//@desc        Delete Update  review
//@route       Delete api/v1/reviews/:id
//@acess       Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    
    const id = req.params.id;
   
    let review  = await Review.findById(id);
 
    console.log(id)
    if(!review){
        return next( new ErrorResponse(`No review with this id`),404);
    }

    //Make sure reviews belong to user or user is an admin

    if(review.user.toString() !== req.user.id && req.user.role!== 'admin'){
        return next(new ErrorResponse('Not authorized to access this route',401))
    }
  
    await review.remove();

    res.status(200).json({ success: true, data: {} });
});