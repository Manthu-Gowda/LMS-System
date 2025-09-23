const express = require('express');
const authController = require('../controllers/authController');
const { validateForgotPassword, validateResetPassword } = require('../validators/authValidators');

const router = express.Router();

router.post('/logout', authController.logout);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', validateResetPassword, authController.resetPassword);

module.exports = router;