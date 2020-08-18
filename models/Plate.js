const mongoose = require('mongoose');

const PlateSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [true, 'Plate name is required']
    },
    description: {
        type: String,
        required: [true, 'Please add a plate description'],
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
    createdAt: {
        type: Date,
        default: Date.now
    },

    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    }
});


//The this keyword on static methods refer to the object created
// Ex const plate = await Plate.find()
// plate.getAverageCost
PlateSchema.statics.getAverageCost = async function (restaurantId) {


    const obj = await this.aggregate([
        {
            $match: { restaurant: restaurantId }
        },
        {
            $group: {
                _id: '$restaurant',
                averageCost: { $avg: '$price' }
            }
        }
    ]);

    try {
        if (obj[0]) {
             await this.model("Restaurant").findByIdAndUpdate(restaurantId, {
               averageCost:Math.ceil(obj[0].averageCost) ,
             });
           } else {
             await this.model("Restaurant").findByIdAndUpdate(restaurantId, {
               averageCost: undefined,
             });
           }
         } catch (err) {
           console.error(err);
         }
}

// Call getAverageCost after save
PlateSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.restaurant)
})

// Call getAverageCost before remove
PlateSchema.pre('remove', async function () {
    await this.constructor.getAverageCost(this.restaurant)
   
})


module.exports = mongoose.model('Plate', PlateSchema);