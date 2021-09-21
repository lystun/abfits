// import the category Model
const Category = require('./../models/categoryModel');

//import the error handler
const HandlerError = require('./../utils/handleError');

// get all categories
exports.getCategories = async (req, res, next) => {
    const categories = await Category.find();

    res.status(200)
        .json({
            status: "success",
            records: categories.length,
            data: categories
        });
}

//create a category
exports.createCategory = async (req, res, next) => {
    try {
        //get the body
        const { name, description } = req.body;

        //check if the required fields are present
        if(!name || !description) return next( new HandlerError("Fields is required", 400) );

        //create a new record in the database
        const category = await Category.create(req.body);

        res.status(200)
            .json({
                status: "success",
                data: category
            });
    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message
            });
    }
    
}

// get one category
exports.getCategory = async (req, res, next) => {
    try {
        //get the parameter
        const { id } = req.params;

        //lookup the id in the category
        const category = await Category.findById(id);

        if(!category) return next(new HandlerError("No category with this ID was found", 404));

        res.status(200)
            .json({
                status: "success",
                data: category
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });   
    }
}

// update category
exports.updateCategory = async (req, res, next) => {
    try {
        //get the parameter
        const { id } = req.params;

        //get the body
        const { name, description } = req.body;

        //lookup the id in the category
        const category = await Category.findById(id);

        //determine if the category exists
        if(!category) return next(new HandlerError("No category with this ID was found", 404));

        category.name = name;
        category.description = description;

        res.status(200)
            .json({
                status: "success",
                data: category
            });

    } catch (error) {
        res.status(404)
            .json({
                status: "fail",
                message: error.message 
            });   
    }
}

//delete category
exports.deleteCategory = async (req, res, next) => {
    try {
        //get the parameter
        const { id } = req.params;

        //lookup the id in the category
        await Category.findByIdAndDelete(id);

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