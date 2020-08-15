const express = require('express');
const {
    getPlate
    } = require('../controllers/plates');

const router = express.Router({mergeParams:true});

router.route('/').get(getPlate);


module.exports = router;