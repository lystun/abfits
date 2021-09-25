const express = require('express');

const { getUsers, deleteUser, updateUser } = require('./../controllers/userController');

const router = express.Router();

router.route('/')
    .get(getUsers)

router.route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;