const mongoose = require('mongoose');
const Restaurant = require('./Restaurant');
const Plate = require('./Plate');
const ErrorResponse = require('../utils/errorResponse');

const OrderSchema = new mongoose.Schema({

    createdAt: {
        type: Date,
        default: Date.now
    },
    requiredAt: {
        type: Date,
        default: new Date(+new Date() + 30 * 60 * 1000)
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: String,
        enum: [
            'Recived',
            'Accepted',
            'Sent',
            'Completed'
        ],
        default: 'Recived'
    },
    plates: [{
        plate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plate',
            required: true
        },
        quantity: Number
    }],

    total: Number

})



// Call getAverageCost after save
OrderSchema.pre('save', async function () {

    const restaurant = await Restaurant.findById(this.restaurant);
    const shippingCost = restaurant.shippingCost || 0;

    const totale = await this.plates.reduce(async (sum, elem) => {

        let plate = await Plate.findById(elem.plate)
        
        return await sum +( plate.price * elem.quantity)

    },shippingCost)

  
    this.total = totale;

})








module.exports = mongoose.model('Order', OrderSchema);