const express = require('express');
const { getPayments, getPayment, createPayment, deletePayment, updatePayment } = require('../controllers/paymentController')
const router = express.Router();

router.route('/')
    .get(getPayments) //get all categories
    .post( createPayment ) //create a style

router.route('/:id')
    .get(getPayment) //get a single style by id
    .patch( updatePayment ) //update a style by id
    .delete( deletePayment ) //update a style by id

module.exports = router;