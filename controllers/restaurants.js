

//@desc        Get all restaurant
//@route       GET api/v1/restaurants
//@acess        Public
exports.getRestaurants = (req, res, next) => {
    res.status(200).json({ success: true });
}

// @desc        Get single restaurant
// @route       GET api/v1/restaurants/:id
//@acess        Public
exports.getSingleRestaurant = (req, res, next) => {
    res.status(200).json({ success: true });
}


// @desc        Create new restaurant
// @route       POST api/v1/restaurants
//@acess        Private
exports.createRestaurant = (req, res, next) => {
    res.status(200).json({ success: true });
}

// @desc        update  restaurant
// @route       PUT api/v1/restaurant/:id
//@acess        Private
exports.updateRestaurant = (req, res, next) => {
    res.status(200).json({ success: true });
}

// @desc        delete all restaurant
// @route       DELETE api/v1/restaurant/:id
//@acess        Public
exports.deleteRestaurant = (req, res, next) => {
    res.status(200).json({ success: true });
}