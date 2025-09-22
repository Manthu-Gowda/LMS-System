const express = require('express')
const enrollmentController = require('../controllers/enrollmentController')
const { auth } = require('../middleware/auth')
const { validateEnrollment } = require('../validators/enrollmentValidators')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment endpoints
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enrolled successfully
 *       400:
 *         description: Already enrolled or invalid course
 */
router.post('/', auth, validateEnrollment, enrollmentController.enrollInCourse)

/**
 * @swagger
 * /enrollments/me:
 *   get:
 *     summary: Get my enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollments retrieved successfully
 */
router.get('/me', auth, enrollmentController.getMyEnrollments)

module.exports = router