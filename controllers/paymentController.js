const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require('uuid');
const User = require("../models/userModel");

//just for testing
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({}); 

        res.status(200).json({
            status:"success",
            records: payments.length,
            data: payments
        })
        
    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

//just for testing

exports.getPayment = async (req, res, next) => {
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

exports.createPayment = async (req, res, next) => {
    try {
        
        const types = ["card", "transfer", "cash"];
        let users = await User.find().select("id");
        users = users.map( (el) => el.id );

        const getRandom = (num) => {
            return Math.floor(Math.random() * num );
        }
        
        const paymentInfo = {
            paymentId: uuidv4(),
            amount: getRandom(10000),
            type: types[getRandom(types.length)],
            user: users[getRandom(users.length)],
        }

        const payment = await Payment.create(paymentInfo);

        res.status(201).json({
            status:"success",
            data: payment
        })


    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}


exports.updatePayment = async (req, res, next) => {
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


exports.deletePayment = async (req, res, next) => {
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