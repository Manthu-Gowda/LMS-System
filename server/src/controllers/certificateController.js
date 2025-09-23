const path = require('path')
const fs = require('fs').promises
const Certificate = require('../models/Certificate')
const logger = require('../utils/logger')

// Get my certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.userId

    const certificates = await Certificate.find({ user: userId, isValid: true })
      .populate('course', 'title slug')
      .populate('user', 'name email')
      .sort({ issuedAt: -1 })

    res.status(200).json({ data: certificates })
  } catch (error) {
    logger.error('Get my certificates error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get certificate (download PDF)
exports.getCertificate = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const certificate = await Certificate.findById(id)
      .populate('user', 'name email')
      .populate('course', 'title')

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    // Check ownership (user can only download their own certificates, admin can download any)
    if (req.user.role !== 'admin' && certificate.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Check if PDF file exists
    const pdfPath = path.join(process.cwd(), certificate.pdfPath)
    
    try {
      await fs.access(pdfPath)
    } catch (fileError) {
      logger.error(`Certificate PDF not found: ${pdfPath}`)
      return res.status(404).json({ message: 'Certificate file not found' })
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateId}.pdf"`)
    
    // Stream the PDF file
    const pdfBuffer = await fs.readFile(pdfPath)
    res.send(pdfBuffer)

    logger.info(`Certificate downloaded: ${certificate.certificateId} by user ${userId}`)
  } catch (error) {
    logger.error('Get certificate error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}