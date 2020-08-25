const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const Plate = require('../models/Plate');


//@desc        Get all orders
//@route       GET api/v1/orders
//@route       GET  api/v1/restaurant/:restaurantId/orders
//@acess       Private
exports.getOrders = asyncHandler(async (req, res, next) => {


    if (req.params.restaurantId) {
        const orders = await Order.find({ restaurant: req.params.restaurantId });
        return res.status(200).json(
            {
                success: true,
                count: orders.length,
                data: orders
            }
        );
    } else {
        res.status(200).json(res.advanceResults);
    }
});


//@desc        Get single Order
//@route       GET api/v1/orders/:id
//@acess       Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('restaurant', 'name description');
    
    if(!order){
        return next(new ErrorResponse('No order with this id',404));
    }

    res.status(200).json({
        success: true,
        data: order
    })
});


//@desc        add  Order
//@route       POST api/v1/restaurant/:restauranId/orders
//@acess       Private
exports.addOrder = asyncHandler(async (req, res, next) => {
    //Add user and the restaurant  to req.body
    req.body.user = req.user.id;
    req.body.restaurant = req.params.restaurantId;

    const plates = req.body.plates

    if(plates.length === 0) return next(new ErrorResponse('Please isert the id of the plates you want to order',400));

   
    const restaurant  = await Restaurant.findById(req.params.restaurantId);
 
    if(!restaurant){
        return next( new ErrorResponse(`No restaurant with this id`),404);
    }
    let menu =  await Plate.find({restaurant : req.params.restaurantId});
    let filtered = menu.filter(element =>
        plates.includes(element._id.toString()) 
    )
   
    if(filtered.length !== plates.length){
        return next(new ErrorResponse('Impossibile effettuare ordine ', 400));
    }
    
  
    const order = await Order.create(req.body);

    res.status(201).json({ success: true, data: order });
});

//@desc        Delete single Order
//@route       DELETE api/v1/orders/:id
//@acess       Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {

   
    let order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404));
    }


    await order.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});


//@desc        Update single order
//@route       PUT api/v1/orders/:id
//@acess       Private
exports.updateOrder = asyncHandler(async (req, res, next) => {

   
    let order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`Order not found with the id of ${id}`, 404));
    }

     //Make sure user is the owner of the restaurant
     if(order.user.toString() !== req.user.id && req.user.id !== 'admin'){
        return next(new ErrorResponse('User non authorazied to update a order to this restaurant',401))
    }


    order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators:true, useFindAndModify:false});

    res.status(200).json({
        success: true,
        data: order
    })
});