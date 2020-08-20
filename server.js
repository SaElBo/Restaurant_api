const path = require ('path');
const express = require('express');
const dotEnv = require('dotenv');
const morgan = require ('morgan');
const colors = require ('colors');
const fileupload = require ('express-fileupload');
const coockieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// Load env vars
dotEnv.config({ path: './config/config.env' });

//connect to database
connectDB();


//Route files 
const restaurants = require ('./routes/restaurants');
const plates = require ('./routes/plates');
const auth = require ('./routes/auth');


const app = express();

//BODY PARSER

app.use(express.json());

//Cookie parser
app.use(coockieParser());


//DEV logger middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

app.use(express.static(path.join(__dirname,'public')));

//Mount routers 
app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/plates', plates);
app.use('/api/v1/auth', auth);

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