const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },

    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Insert a valid Email']
    },

    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

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


    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password 

UserSchema.pre('save', async function (next) {

    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign jwt and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in db

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generete and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    //Generete token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetaPasswordToken fiel
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //Set the expire 
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


//Geocode & create location fields

UserSchema.pre('save', async function(next){
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

module.exports = mongoose.model('User', UserSchema);