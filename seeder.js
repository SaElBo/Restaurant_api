const fs = require ('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env
dotenv.config({path : './config/config.env'});


//load models

const Restaurant = require ('./models/Restaurant');
const Plate = require('./models/Plate');

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

//insert into db
const importData = async ()=>{
    try{
        await Restaurant.create(restaurants);
        await Plate.create(plates);

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

        console.log('DATA DESTROYED...'.red.inverse);
        process.exit();
    }
    catch(err){
        console.error(err);
    }
}

if(process.argv[2] === '-i'){
    importData();   
}else if (process.argv[2] === '-d'){
    deleteData();
}