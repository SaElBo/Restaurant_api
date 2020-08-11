const mongoose = require('mongoose');

const connectDB = async () => {


    const connection = await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    // option to avoid deprecation error ↑

    console.log(`MongoDB connected : ${connection.connection.host}`.cyan.underline.bold);

}


module.exports = connectDB;
