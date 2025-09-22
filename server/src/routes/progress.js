const express = require('express')
const progressController = require('../controllers/progressController')
const { auth } = require('../middleware/auth')
const { validateProgress } = require('../validators/progressValidators')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Learning progress endpoints
 */

/**
 * @swagger
 * /progress/{enrollmentId}:
 *   patch:
 *     summary: Update learning progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentCompleted:
 *                 type: array
 *                 items:
 *                   type: number
 *               lastAccessedContent:
 *                 type: number
 *               timeSpent:
 *                 type: number
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       404:
 *         description: Enrollment not found
 */
router.patch('/:enrollmentId', auth, validateProgress, progressController.updateProgress)

module.exports = router