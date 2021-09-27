const nodemailer = require('nodemailer');
const User  = require('./../models/userModel');
const validator = require('validator');
const HandlerError = require('../utils/handleError');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6b7a8ce2f2c750",
      pass: "d9936580c8b620"
    }
});

const jwtSign = (id) => {
    const token = jwt.sign(
        {id}, 
        process.env.JWT_SIGN, 
        { expiresIn: process.env.JWT_EXPIRES } 
    );

    return token;
}

const tokenCookieRes = (user, statusCode, res)=>{
    //sign the token
    const token = jwtSign(user._id);
    
    const expiration = new Date( Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 );
    const cookieOptions = {
        expires: expiration,
        httpOnly: true,
    }

    if( process.env.NODE_ENV === 'production' ) cookieOptions.secure = true

    //define the expiration time of the cookie;
    res.cookie("jwt", token, cookieOptions);

    // return response
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    })
}

//just for testing
exports.testHandler = async (req, res, next) => {
    try {
        
        console.log(req.user);


    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

//register user
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
        // const token = await crypto.randomBytes(256).toString('hex');
        // const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
        
        //create hashed token
        const hashedToken = uuidv4();

        const user = {
            email: email.toLowerCase(),
            name: firstName+' '+lastName,
            password,
            confirmPassword,
            verificationToken: hashedToken,
            verificationTokenExpires: Date.now() + 60*60*1000, //1 hour 
        }

        const url = `http://127.0.0.1:8000/api/v1/auth/verify/${hashedToken}`;

        var mailOptions = {
            from: 'admin@test.com',
            to: user.email,
            subject: 'Welcome. Please verify your email address',
            html: ` click on the link or paste it in your browser tab <a href=${url}>Verify Email</a> `
        };

        transport.sendMail(mailOptions, (err, data)=>{
            if(err){
                console.log(err);
            }else {
                console.log("Email sent");
            }
        });

        //create user
        const newUser = await User.create(user);
        
        //return the response
        tokenCookieRes(newUser, 201, res);

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

// login user
exports.loginUser = async (req, res, next) => {
    try {
        //get user credentials
        const { email, password } = req.body;

        if(!email || !password) return next(new HandlerError("Please enter your email and password.", 400));

        //check if it's in the record
        const user = await User.findOne({email}).select('+password -createdAt -updatedAt');
        if(!user) return next(new HandlerError("Incorrect email and/or password", 400));

        //check if the password is correct with that in the database
        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword) return next(new HandlerError("Incorrect email and/or password", 400));

        //check if the user is active
        if(!user.active) return next(new HandlerError("Please verify your email address.", 400));

        //log the user in
        tokenCookieRes(user, 200, res);
        
    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

//verify email address
exports.verifyEmail = async (req, res, next) => {
    try {

        //get user with this token;
        const user = await User.findOne({ verificationToken: req.params.token });
        
        //check if user exists
        if(!user) return next(new HandlerError("There is no user with that token.", 400));

        //check if the token has expired
        if( Date.now(user.verificationTokenExpires) < Date.now() ){
            return next(new HandlerError("The user token has expired.", 400));
        }

        user.active = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
       
        res.status(200)
            .json({
                status: "success",
                data: user
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}

//autheticate user
exports.authenticateUser = async (req, res, next) => {
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            //get the token from the request
            const token = req.headers.authorization.split(" ")[1];

            if(!token){
                return next(new HandlerError("You're not logged in. Please log in.", 401));
            };

            //decode the encrypted jwt token
            const decoded = await jwt.verify(token, process.env.JWT_SIGN);

            //check if the token has not expired
            
            
            //check if the user still exists in database
            const user = await User.findById(decoded.id);

            if(!user) return next(new HandlerError( "User no longer exists on the platform", 404));

            //carry along the information unto the next handler
            req.user = user;

            next();
        }else {
            return next(new HandlerError("Send in a valid authorization.", 400))
        }

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}
