const path = require('path')
const fs = require('fs').promises
const puppeteer = require('puppeteer')
const Certificate = require('../models/Certificate')
const Enrollment = require('../models/Enrollment')
const emailService = require('./emailService')
const logger = require('../utils/logger')

// Generate certificate
exports.generateCertificate = async (enrollmentId) => {
  try {
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('user', 'name email')
      .populate('course', 'title')

    if (!enrollment) {
      throw new Error('Enrollment not found')
    }

    if (!enrollment.checkCompletionRequirements()) {
      throw new Error('Course completion requirements not met')
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ enrollment: enrollmentId })
    if (existingCert) {
      return existingCert
    }

    // Generate HTML template
    const htmlTemplate = generateCertificateHTML(enrollment)

    // Generate PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' })

    // Ensure certificates directory exists
    const certDir = path.join(process.env.UPLOAD_DIR || './uploads', 'certificates')
    await fs.mkdir(certDir, { recursive: true })

    const filename = `certificate-${Date.now()}-${enrollment._id}.pdf`
    const pdfPath = path.join(certDir, filename)

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })

    await browser.close()

    // Create certificate record
    const certificate = new Certificate({
      user: enrollment.user._id,
      course: enrollment.course._id,
      enrollment: enrollmentId,
      pdfPath: `/uploads/certificates/${filename}`
    })

    await certificate.save()

    // Send congratulations email
    try {
      await emailService.sendCertificateEmail(
        enrollment.user.email,
        enrollment.user.name,
        enrollment.course.title,
        certificate.certificateId,
        pdfPath
      )
    } catch (emailError) {
      logger.error('Certificate email send error:', emailError)
      // Don't fail certificate generation if email fails
    }

    logger.info(`Certificate generated: ${certificate.certificateId}`)

    return certificate
  } catch (error) {
    logger.error('Certificate generation error:', error)
    throw error
  }
}

// Generate HTML template for certificate
function generateCertificateHTML(enrollment) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Certificate of Completion</title>
        <style>
            body {
                font-family: 'Georgia', serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .certificate {
                background: white;
                border: 20px solid #1890ff;
                border-radius: 20px;
                padding: 60px;
                max-width: 800px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                position: relative;
            }
            .certificate::before {
                content: '';
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                bottom: 10px;
                border: 3px solid #f0f0f0;
                border-radius: 10px;
            }
            .header {
                color: #1890ff;
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 3px;
            }
            .subheader {
                font-size: 24px;
                color: #666;
                margin-bottom: 40px;
                font-style: italic;
            }
            .recipient {
                font-size: 36px;
                color: #333;
                margin: 30px 0;
                font-weight: bold;
                border-bottom: 3px solid #1890ff;
                padding-bottom: 10px;
            }
            .course-title {
                font-size: 28px;
                color: #1890ff;
                margin: 30px 0;
                font-weight: bold;
            }
            .description {
                font-size: 18px;
                color: #666;
                margin: 30px 0;
                line-height: 1.6;
            }
            .footer {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
                align-items: center;
            }
            .date, .signature {
                text-align: center;
                color: #666;
            }
            .date-label, .signature-label {
                font-size: 14px;
                margin-bottom: 10px;
                color: #999;
            }
            .date-value, .signature-value {
                font-size: 16px;
                font-weight: bold;
                border-top: 2px solid #333;
                padding-top: 5px;
            }
            .certificate-id {
                position: absolute;
                bottom: 20px;
                right: 20px;
                font-size: 12px;
                color: #999;
                font-family: monospace;
            }
            .logo {
                color: #1890ff;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="logo">🎓 LMS Academy</div>
            <div class="header">Certificate of Completion</div>
            <div class="subheader">This is to certify that</div>
            
            <div class="recipient">${enrollment.user.name}</div>
            
            <div class="description">
                has successfully completed the course
            </div>
            
            <div class="course-title">${enrollment.course.title}</div>
            
            <div class="description">
                demonstrating exceptional dedication to learning and professional development.
                This achievement reflects a commitment to excellence and continuous growth.
            </div>
            
            <div class="footer">
                <div class="date">
                    <div class="date-label">Date of Completion</div>
                    <div class="date-value">${currentDate}</div>
                </div>
                <div class="signature">
                    <div class="signature-label">Authorized Signature</div>
                    <div class="signature-value">LMS Administration</div>
                </div>
            </div>
            
            <div class="certificate-id">Certificate ID: ${enrollment._id}-${Date.now()}</div>
        </div>
    </body>
    </html>
  `
}