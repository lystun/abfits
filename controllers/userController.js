const User  = require('./../models/userModel');
const validator = require('validator');
const HandlerError = require('../utils/handleError');

// get all users
exports.getUsers = async (req, res, next) => {
    try {

        const users = await User.find();
        
        res.status(200)
            .json({
                status: "success",
                data: users
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.createUser = async (req, res, next) => {
    try {
        const { email, firstName, lastName, password, confirmPassword } = req.body;

        // check is email exists and it's in a proper format
        if( !email || !validator.isEmail(email) ){
            return next( new HandlerError("Please enter a valid email address.", 400));
        }
        
        //check is the firstname and  lastname were provided
        if(!firstName && !lastName){
            return next( new HandlerError("Please enter your name.", 400));
        }

        //check if password is valid
        if(password.length < 8 || !password){
            return next(new HandlerError("Password must be greater...", 400));
        }
        
        //check is password is truly confirmed
        if(password !== confirmPassword ){
            return next(new HandlerError("Password mismatch. Please confirm your password.", 400));
        }

        //check if user already exists
        const checkUser = await User.findOne({ email });

        if(checkUser){
            return next( new HandlerError("Please user already exist", 400));
        }

        //verify user email


        const user = {
            email: email.toLowerCase(),
            name: firstName+' '+lastName,
            password,
            confirmPassword,
        }

        const newUser = await User.create(user);
        
        res.status(200)
            .json({
                status: "success",
                data: newUser
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.scaffold = async (req, res, next) => {
    try {
        
        res.status(200)
            .json({
                status: "success",
                data: []
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

exports.scaffold = async (req, res, next) => {
    try {
        
        res.status(200)
            .json({
                status: "success",
                data: []
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}