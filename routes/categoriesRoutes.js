const express = require('express');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require('./../controllers/categoryController')

const router = express.Router();

router.route('/')
    .get(getCategories) //get all categories
    .post( createCategory ) //create a category

router.route('/:id')
    .get(getCategory) //get a single category by id
    .patch( updateCategory ) //update a category by id
    .delete( deleteCategory ) //update a category by id


module.exports = router;