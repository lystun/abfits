const express = require('express');

const { createUser, sendMail, verifyEmail, loginUser } = require('./../controllers/authController');

const router = express.Router();

router.post('/verify/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/register', createUser);

module.exports = router;