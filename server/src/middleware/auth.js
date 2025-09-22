const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user details
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. User not found or inactive.'
        })
      }

      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
      
      next()
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Authorization middleware
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      })
    }
    next()
  }
}