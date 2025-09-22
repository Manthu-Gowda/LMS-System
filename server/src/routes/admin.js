const express = require('express')
const adminController = require('../controllers/adminController')
const { auth, authorize } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard endpoints
 */

/**
 * @swagger
 * /admin/overview:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview data retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/overview', auth, authorize(['admin']), adminController.getOverview)

/**
 * @swagger
 * /admin/users/{id}/progress:
 *   get:
 *     summary: Get user progress details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User progress retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:id/progress', auth, authorize(['admin']), adminController.getUserProgress)

module.exports = router