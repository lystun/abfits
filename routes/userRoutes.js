const express = require('express');

const { getUsers, deleteUser } = require('./../controllers/userController');

const router = express.Router();

router.route('/')
    .get(getUsers)

router.route('/:id')
    .delete(deleteUser)

module.exports = router;