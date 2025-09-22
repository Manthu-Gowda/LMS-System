const express = require('express')
const certificateController = require('../controllers/certificateController')
const { auth, authorize } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Certificate management endpoints
 */

/**
 * @swagger
 * /certificates/me:
 *   get:
 *     summary: Get my certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully
 */
router.get('/me', auth, certificateController.getMyCertificates)

/**
 * @swagger
 * /certificates/{id}:
 *   get:
 *     summary: Download certificate PDF
 *     tags: [Certificates]
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
 *         description: Certificate PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Certificate not found
 */
router.get('/:id', auth, certificateController.getCertificate)

module.exports = router