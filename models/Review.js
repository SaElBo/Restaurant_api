const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: [true, 'Plate add a title for the review']
    },
    text: {
        type: String,
        required: [true, 'Please add a review'],
        maxlength: 500,
    },
    rating: {
        type: Number,
        max: 5,
        min: 1,
        required: [true, 'Please add a rating']
    },

    createdAt: {
        type: Date,
        default: Date.now
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
    }
});

//Prevent user from submitting more than one reviews per restaurant
ReviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });


ReviewSchema.statics.getAverageRating = async function (restaurantId) {


    const obj = await this.aggregate([
        {
            $match: { restaurant: restaurantId }
        },
        {
            $group: {
                _id: '$restaurant',
                averageRating : { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (obj[0]) {
             await this.model("Restaurant").findByIdAndUpdate(restaurantId, {
               averageRating:Math.ceil(obj[0].averageRating) ,
             });
           } else {
             await this.model("Restaurant").findByIdAndUpdate(restaurantId, {
               averageRating: undefined,
             });
           }
         } catch (err) {
           console.error(err);
         }
}




// Call getAverageCost after save
ReviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.restaurant)
})

// Call getAverageCost before remove
ReviewSchema.pre('remove', async function () {
    await this.constructor.getAverageRating(this.restaurant)
   
})



module.exports = mongoose.model('Review', ReviewSchema);