const express = require('express');
const dotEnv = require('dotenv');

//Route files 
const restaurants = require ('./routes/restaurant');

// Load env vars
dotEnv.config({ path: './config/config.env' });

const app = express();

//Mount routers 
app.use('/api/v1/restaurants', restaurants);


const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode,  on port ${PORT}`)
);