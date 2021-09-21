// import the Style Model
const Style = require('../models/styleModel');

//import the error handler
const HandlerError = require('../utils/handleError');

// get all styles
exports.getStyles = async (req, res, next) => {
    const styles = await Style.find();

    res.status(200)
        .json({
            status: "success",
            records: styles.length,
            data: styles
        });
}

//create a Style
exports.createStyle = async (req, res, next) => {
    try {
        //get the body
        const { name, description, category } = req.body;

        //check if the required fields are present
        if(!name || !description || !category) return next( new HandlerError("Fields is required", 400) );

        //create a new record in the database
        const style = await Style.create(req.body);

        res.status(200)
            .json({
                status: "success",
                data: style
            });
    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message
            });
    }
    
}

// get one Style
exports.getStyle = async (req, res, next) => {
    try {
        //get the parameter
        const { id } = req.params;

        //lookup the id in the Style
        const style = await Style.findById(id);

        if(!style) return next(new HandlerError("No Style with this ID was found", 404));

        res.status(200)
            .json({
                status: "success",
                data: style
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });   
    }
}

// update Style
exports.updateStyle = async (req, res, next) => {
    try {
        //get the parameter
        const { id } = req.params;

        //get the body
        const { name, description, category } = req.body;

        //lookup the id in the Style
        const style = await Style.findById(id);

        //determine if the Style exists
        if(!style) return next(new HandlerError("No Style with this ID was found", 404));

        style.name = name;
        style.description = description;
        style.category = category;

        style.save();

        res.status(200)
            .json({
                status: "success",
                data: style
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });   
    }
}

//delete Style
exports.deleteStyle = async (req, res, next) => {
    try {
        //get the parameter
        const { id } = req.params;

        //lookup the id in the Style
        await Style.findByIdAndDelete(id);

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