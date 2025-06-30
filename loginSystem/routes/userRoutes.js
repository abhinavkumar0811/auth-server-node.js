const express = require('express');
const userController = require('../controllers/userController');
const userAuthentication = require('../midware/userAuthenticationMidware');

const router = express.Router();



router.post('/register', userController.signUp);
router.post('/login', userController.signIn);
router.get('/verify/:token', userController.verify);
router.post('/forgetpassword', userController.forgetPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/changedPassword', userAuthentication, userController.changedPassword);







module.exports = router;