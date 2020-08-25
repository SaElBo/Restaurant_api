const express = require('express');
const {
    getOrder,
    getOrders,
    addOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/orders');

const Order = require('../models/Order');
const advanceResults = require('../middleware/advanceResults')

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('publisher', 'admin'), advanceResults(Order, {
        path: 'restaurant',
        select: 'name description'
    }),getOrders)
    .post(protect, authorize('user', 'admin'), addOrder);

router.route('/:id')
    .get(protect, authorize('publisher', 'admin'),getOrder)
    .put(protect, authorize('admin'), updateOrder)
    .delete(protect, authorize('admin'), deleteOrder);


module.exports = router;