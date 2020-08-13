const express = require('express');
const dotEnv = require('dotenv');
const morgan = require ('morgan');
const colors = require ('colors');

const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// Load env vars
dotEnv.config({ path: './config/config.env' });

//connect to database
connectDB();


//Route files 
const restaurants = require ('./routes/restaurants');


const app = express();

//BODY PARSER

app.use(express.json());


//DEV logger middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Mount routers 
app.use('/api/v1/restaurants', restaurants);

app.use(errorHandler)


const PORT = process.env.PORT || 3000

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode,  on port ${PORT}`.yellow.bold)
    
);


//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error : ${err.message}`.red);
    //Close server & exit process
    server.close(()=> process.exit(1));
});