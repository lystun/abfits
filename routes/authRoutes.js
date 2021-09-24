const express = require('express');

const { createUser, sendMail, verifyEmail, loginUser, testHandler, authenticateUser } = require('./../controllers/authController');

const router = express.Router();

router.get('/verify/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/register', createUser);

//just for testing
router.post('/test', authenticateUser, testHandler);

module.exports = router;