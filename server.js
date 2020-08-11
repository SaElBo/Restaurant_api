const express = require('express');
const dotEnv = require('dotenv');
const morgan = require ('morgan');

//Route files 
const restaurants = require ('./routes/restaurants');

// Load env vars
dotEnv.config({ path: './config/config.env' });

const app = express();

//DEV logger middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Mount routers 
app.use('/api/v1/restaurants', restaurants);


const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode,  on port ${PORT}`)
);