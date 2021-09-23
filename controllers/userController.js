const User  = require('./../models/userModel');
const HandlerError = require('../utils/handleError');

// get all users
exports.getUsers = async (req, res, next) => {
    try {

        const users = await User.find();
        
        res.status(200)
            .json({
                status: "success",
                records: users.length,
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

//delete a user
exports.deleteUser = async (req, res, next) => {
    try {

        await User.findByIdAndDelete(req.params.id);
        
        res.status(200)
            .json({
                status: "success",
                data: null
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });
    } 
}
