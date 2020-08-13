const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const ErrorResponde = require('../utils/errorResponse');

//@desc        Get all restaurant
//@route       GET api/v1/restaurants
//@acess        Public
exports.getRestaurants = async (req, res, next) => {


    try {
        const allRestaurants = await Restaurant.find({});
        res.status(200).json({ success: true, count: allRestaurants.length, data: allRestaurants });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }


}

// @desc        Get single restaurant
// @route       GET api/v1/restaurants/:id
//@acess        Public
exports.getSingleRestaurant = async (req, res, next) => {
    const id = req.params.id
    console.log(id);
    try {
        const singleRestaurant = await Restaurant.findById(id);

        if(!singleRestaurant){
            return next(new ErrorResponse(`Restaurant not found with the id of ${id}`,404));

        }
        res.status(200).json({ success: true, data: singleRestaurant });
    } catch (err) {
        // return res.status(400).json({ success: false, error: err.message });
        next(new ErrorResponse(`Restaurant not found with the id of ${id}`,404));
        
    }

}


// @desc        Create new restaurant
// @route       POST api/v1/restaurants
//@acess        Private
exports.createRestaurant = async (req, res, next) => {

    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: restaurant });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }




}

// @desc        update  restaurant
// @route       PUT api/v1/restaurant/:id
//@acess        Private
exports.updateRestaurant = async (req, res, next) => {

    const id = req.params.id
    const data = req.body

    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, data: updatedRestaurant });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }



}

// @desc        delete all restaurant
// @route       DELETE api/v1/restaurant/:id
//@acess        Public
exports.deleteRestaurant = async (req, res, next) => {

    const id = req.params.id


    try {
        const restaurant = await Restaurant.findByIdAndDelete(id);
        if (!restaurant) {
            return res.status(400).json({ success: false, error: err.message });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
}