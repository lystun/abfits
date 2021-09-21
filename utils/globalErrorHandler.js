module.exports = (err, req, res, next) => {
    
    res.status(err.statusCode).json({
        status: "fail",
        message: err.message,
    })
}