const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [20, 'Name can not be more than 20 characters']
    },

    slug: String,

    description: {
        type: String,
        required: [true, 'Please add a description'],
        unique: true,
        trim: true,
        maxlength: [500, 'description can not be more than 500 characters']
    },

    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please insert a valid URL']
    },
    phone :{
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 
                'Insert a valid Email']
    },
    address : {
        type : String,
        required: [true, 'Please add an adress']
    },
    // location: {
    //     //geojson
    //     type: {
    //         type: String,
    //         enum : ['Point'],
    //         required : true 
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required : true ,
    //         index: '2dsphere'
    //     },
    //     formattedAddress: String,
    //     street: String,
    //     city: String,
    //     state: String,
    //     zipcode: String,
    //     country: String,
    // },

    cuisine:{
        type: [String],
        required: true,
        enum: [
            'Italian',
            'Exotic',
            'Fast food',
            'Fish',
            'Other'
        ]
    },

 
    averageRating : {
        type: Number,
        min: [1, 'Rating must be at leas 1'],
        max: [10, 'Rating must not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


});

module.exports = mongoose.model('Restaurant', RestaurantSchema);