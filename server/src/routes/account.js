const express = require('express');
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidators');

const router = express.Router();

router.post('/Login', validateLogin, authController.login);
router.post('/Register', validateSignup, authController.signup);
router.get('/ServerStatusCheck', (req, res) => res.status(200).json({ success: true }));

module.exports = router;