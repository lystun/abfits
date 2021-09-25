const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const HandlerError = require("../utils/handleError");
const { v4: uuidv4 } = require('uuid');

const handlePayment = (amount, email) =>{

    const types = ["card", "transfer", "cash"];
    const getRandom = (num) => {
        return Math.floor(Math.random() * num );
    }

    const paymentInfo = {
        paymentId: uuidv4(),
        amount,
        type: types[getRandom(types.length)],
    }

    return paymentInfo;
}

//just for testing
exports.getOrders = async (req, res, next) => {
    try {
        
        const orders = await Order.find({}); 

        res.status(200).json({
            status:"success",
            data: orders
        })
        
    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.getOrder = async (req, res, next) => {
    try {
        
        console.log("checking");

        res.status(200).json({
            status:"success",
            data: []
        })


    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.createOrder = async (req, res, next) => {
    try {
        //determine due delivery
        let dueDelivery;
        if(req.body.dueDelivery == 'regular'){
            dueDelivery = new Date(Date.now() + 5*24*60*60*1000 );
        }else if(req.body.dueDelivery == 'express'){
            dueDelivery = new Date(Date.now() + 2*24*60*60*1000);
        }

        //get the user from the req based on the preceding middleware
        const user = req.user;
        
        //determine if user exists and if user is active
        if(!user && !user.active) return next(new HandlerError("User is not activated. Please verify your email", 400));

        //check if the amount was specified
        if(!req.body.amount) return next(new HandlerError("Amount is not specified", 404));
        
        //handle payment (paystack)
        const paymentDetails = handlePayment(req.body.amount, user.email);

        const paymentInfo = {
            user: user.id,
            type: paymentDetails.type,
            paymentId: paymentDetails.paymentId,
            amount: paymentDetails.amount,
        }

        //store the payment information
        const payment = await Payment.create(paymentInfo);
        if(!payment) return next(new HandlerError("Payment was not stored", 500));
        
        //check for user measurements
        if(!user.measurements) return next(new HandlerError("Please user measurement is required", 404));
        
        // //get the request from user
        const userOrder = {
            style: req.body.style,
            measurements: user.measurements,
            dueDelivery,
            user: user.id,
            deliveryLocation: req.body.deliveryLocation,
            paymentId: payment.id
        }

        //create the order
        const order = await Order.create(userOrder);
        if(!order) return next(new HandlerError("Order was not placed successfully.", 500));
            
        res.status(200).json({
            status:"success",
            data: order
        });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.updateOrder = async (req, res, next) => {
    try {
        

        res.status(200).json({
            status:"success",
            data: []
        })


    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.deleteOrder = async (req, res, next) => {
    try {
        

        res.status(200).json({
            status:"success",
            data: []
        })


    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}