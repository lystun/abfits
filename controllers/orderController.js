const Order = require("../models/orderModel");

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

//just for testing

exports.getOrder = async (req, res, next) => {
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


exports.createOrder = async (req, res, next) => {
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