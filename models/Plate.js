const mongoose = require('mongoose');

const PlateSchema = new mongoose.Schema({
    
    title: {
        type: String,
        trim : true,
        required: [true, 'Plate name is required']
    },
    description:{
        type: String,
        required:[true, 'Please add a plate description'],
        max: [40, 'Description must not be more than 40']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    vegan: {
        type: Boolean,
        default: false
    },
    vegetarin: {
        type: Boolean,
        default: false
    },
    glutenFree: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },

    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref : 'Restaurant',
        required: true
    }
});

module.exports = mongoose.model('Plate', PlateSchema);