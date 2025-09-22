const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const emailService = require('../services/emailService')
const logger = require('../utils/logger')

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  })
}

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'user'
    })

    await user.save()

    logger.info(`New user registered: ${email}`)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user }
    })
  } catch (error) {
    logger.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, loginType } = req.body

    // Find user
    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check role based on loginType
    if (loginType === 1 && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      })
    }

    if (loginType === 2 && user.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User account required.'
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    logger.info(`User logged in: ${email}`)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email, isActive: true })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
    
    try {
      await emailService.sendPasswordResetEmail(user.email, user.name, resetUrl)
      
      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      })
    } catch (emailError) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      logger.error('Email send error:', emailError)
      
      res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.'
      })
    }
  } catch (error) {
    logger.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    // Hash token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      isActive: true
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      })
    }

    // Set new password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    logger.info(`Password reset successful for: ${user.email}`)

    res.json({
      success: true,
      message: 'Password reset successful'
    })
  } catch (error) {
    logger.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}