const nodemailer = require('nodemailer')
const logger = require('../utils/logger')

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })
}

// Send password reset email
exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@lms.com',
      to: email,
      subject: 'Password Reset Request - LMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1890ff, #722ed1); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎓 LMS Academy</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hello ${name},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              We received a request to reset your password for your LMS account. 
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #1890ff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If you didn't request this password reset, please ignore this email. 
              This link will expire in 10 minutes for security reasons.
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #1890ff;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">© 2024 LMS Academy. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Password reset email sent to: ${email}`)
  } catch (error) {
    logger.error('Password reset email error:', error)
    throw error
  }
}

// Send certificate email
exports.sendCertificateEmail = async (email, name, courseTitle, certificateId, pdfPath) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@lms.com',
      to: email,
      subject: `🎉 Congratulations! Your Certificate for ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #52c41a, #1890ff); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎓 LMS Academy</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">🎉 Congratulations!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${name},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              We're thrilled to inform you that you have successfully completed the course:
            </p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #52c41a; margin: 20px 0;">
              <h3 style="color: #1890ff; margin: 0;">${courseTitle}</h3>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Your dedication and hard work have paid off! As a token of your achievement, 
              please find your certificate of completion attached to this email.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Certificate ID:</strong> ${certificateId}
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              You can also download your certificate anytime from your dashboard in the LMS platform.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/certificates" 
                 style="background: #52c41a; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                View My Certificates
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Keep up the excellent work and continue your learning journey with us!
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Best regards,<br>
              The LMS Academy Team
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">© 2024 LMS Academy. All rights reserved.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `certificate-${certificateId}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Certificate email sent to: ${email}`)
  } catch (error) {
    logger.error('Certificate email error:', error)
    throw error
  }
}

// Send welcome email
exports.sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@lms.com',
      to: email,
      subject: 'Welcome to LMS Academy! 🎓',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1890ff, #722ed1); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🎓 LMS Academy</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Your Learning Journey!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hello ${name},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Welcome to LMS Academy! We're excited to have you join our community of learners.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Here's what you can do to get started:
            </p>
            
            <ul style="color: #666; line-height: 1.8;">
              <li>Browse our course catalog</li>
              <li>Enroll in courses that interest you</li>
              <li>Track your progress on your dashboard</li>
              <li>Earn certificates upon completion</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/courses" 
                 style="background: #1890ff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Explore Courses
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any questions, feel free to reach out to our support team.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Happy learning!<br>
              The LMS Academy Team
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">© 2024 LMS Academy. All rights reserved.</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Welcome email sent to: ${email}`)
  } catch (error) {
    logger.error('Welcome email error:', error)
    throw error
  }
}