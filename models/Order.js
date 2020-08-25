const mongoose = require('mongoose');
const Restaurant = require('./Restaurant');
const Plate = require('./Plate');
const ErrorResponse = require('../utils/errorResponse');

const OrderSchema = new mongoose.Schema({

    createdAt: {
        type: Date,
        default: Date.now
    },
    requiredAt:{
        type: Date,
        default: new Date(+new Date() + 30*60*1000)
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
        enum:[
            'Recived',
            'Accepted',
            'Sent',
            'Completed'
        ],
        default: 'Recived'
    },
    plates: {
        type: [{type: mongoose.Schema.Types.ObjectId}],
        ref: 'Plate',
        required: true
    }
})





module.exports = mongoose.model('Order', OrderSchema);