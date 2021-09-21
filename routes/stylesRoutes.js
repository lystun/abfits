const express = require('express');
const { getStyles, createStyle, getStyle, updateStyle, deleteStyle } = require('./../controllers/styleController')

const router = express.Router();

router.route('/')
    .get(getStyles) //get all categories
    .post( createStyle ) //create a style

router.route('/:id')
    .get(getStyle) //get a single style by id
    .patch( updateStyle ) //update a style by id
    .delete( deleteStyle ) //update a style by id


module.exports = router;