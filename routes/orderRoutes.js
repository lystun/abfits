const express = require('express');
const { getOrders, getOrder, createOrder, deleteOrder, updateOrder } = require('../controllers/orderController')

const router = express.Router();

router.route('/')
    .get(getOrders) //get all categories
    .post( createOrder ) //create a style

router.route('/:id')
    .get(getOrder) //get a single style by id
    .patch( updateOrder ) //update a style by id
    .delete( deleteOrder ) //update a style by id


module.exports = router;