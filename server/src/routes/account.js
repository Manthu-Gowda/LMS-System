
const express = require('express');
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /Account/Login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       '200':
 *         description: Login successful, returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Bad request, validation error.
 *       '401':
 *         description: Invalid credentials.
 */
router.post('/Login', validateLogin, authController.login);

/**
 * @swagger
 * /Account/Register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's desired username.
 *                 example: "newuser"
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request, validation error (e.g., email already in use).
 */
router.post('/Register', validateSignup, authController.signup);

/**
 * @swagger
 * /Account/ServerStatusCheck:
 *   get:
 *     summary: Checks if the server is running
 *     tags: [Account]
 *     responses:
 *       '200':
 *         description: Server is running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.get('/ServerStatusCheck', (req, res) => res.status(200).json({ success: true }));

module.exports = router;
