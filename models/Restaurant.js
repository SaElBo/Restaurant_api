const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');


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
    location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },

    cuisine:{
        type: [String],
        required: true,
        enum: [
            'Italian',
            'Pizza',
            'Chinese',
            'Japanese',
            'Gelato',
            'Fritti',
            'Gourmet',
            'Kebab',
            'Hamburger',
            'Exotic',
            'FastFood',
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

RestaurantSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower : true });
    next();
})



//Geocode & create location fields

RestaurantSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // Do not save address in DB
  this.address = undefined;
  //format the name insert by the user to have the first letter to upperCase this helps with sorting by name
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  next();
})
module.exports = mongoose.model('Restaurant', RestaurantSchema);