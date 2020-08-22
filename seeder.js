const fs = require ('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env
dotenv.config({path : './config/config.env'});


//load models

const Restaurant = require ('./models/Restaurant');
const Plate = require('./models/Plate');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });


//read json files
const restaurants = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/restaurant.json`, 'utf-8')
    );

const plates = JSON.parse(
        fs.readFileSync(`${__dirname}/_data/plate.json`, 'utf-8')
        );

const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));

//insert into db
const inportData = async ()=>{
    try{
        await Restaurant.create(restaurants);
        await Plate.create(plates);
        await User.create(user);
        await Review.create(reviews);

        console.log('DATA IMPORTED...'.green.inverse);
        process.exit();
    }
    catch(err){
        console.error(err);
    }
}

//Delete data
const deleteData = async ()=>{
    try{
        await Restaurant.deleteMany();
        await Plate.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('DATA DESTROYED...'.red.inverse);
        process.exit();
    }
    catch(err){
        console.error(err);
    }
}

if(process.argv[2] === '-i'){
    inportData();   
}else if (process.argv[2] === '-d'){
    deleteData();
}