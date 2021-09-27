const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const HandlerError = require("../utils/handleError");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// This is the encryption function that encrypts your payload by passing the stringified format and your encryption Key.
function encrypt(key, text){
    var forge = require("node-forge");
    var cipher = forge.cipher.createCipher(
        "3DES-ECB",
        forge.util.createBuffer(key)
    );

    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(text, "utf-8"));
    cipher.finish();
    var encrypted = cipher.output;

    return forge.util.encode64(encrypted.getBytes());
}

//handle payment using paystack
const handlePayment = async (amount, email) =>{
    try {
        //get the card / payment information
        const paymentCardDetails = {
            amount,
            email,
            bank: {
                code: "057",
                account_number: "0000000000"
            },
            birthday: "1995-12-23"
        }

        //define options
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/charge',
            method: 'POST',
            url: "https://api.paystack.co/charge",
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(paymentCardDetails)
        }

        //make payment request
        const res = await axios(options);

        return res; 

    }catch(error){
        console.log(error)
    }
}

// //handle payment using flutterwave
// const handlePayment = async (amount, email) =>{
//     try {
//         //get the card / payment information
//         const paymentCardDetails = {
//             amount,
//             email,
//             tx_ref: uuidv4(),
//             currency: "NGN",
//             card_number: 5399670123490229,
//             cvv: 123,
//             expiry_month: 11,
//             expiry_year: 21
//         }

//         //encrypt the paymentCard details information
//         let key = process.env.FLUTTERWAVE_ENCRYPT_KEY;

//         //encrypted response
//         const encryptedRes = encrypt(key, JSON.stringify(paymentCardDetails) );

//         const res = await axios({
//             method: 'POST',
//             url: "https://api.flutterwave.com/v3/charges?type=card",
//             headers: {
//                 authorization:`Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
//             },
//             data:{
//                 client: encryptedRes
//             }
//         })

//         console.log(res);

//     }catch(error){
//         console.log(error)
//     }
// }

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
        const paymentDetails = await handlePayment(req.body.amount, user.email);

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
        const order = await Order.create({userOrder});
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