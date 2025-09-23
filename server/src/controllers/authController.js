const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (user) => {
    const payload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'user'
    });

    await user.save();

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: { user }
    });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, userName, password, loginType } = req.body;
    const loginIdentifier = email || userName;

    // Find user
    const user = await User.findOne({ email: loginIdentifier });
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials'
      });
    }

    // Check role based on loginType
    if (loginType === 1 && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Access denied. Admin privileges required.'
      });
    }

    if (loginType === 2 && user.role !== 'user') {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Access denied. User account required.'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${loginIdentifier}`);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessTokenResponseModel: {
          accessToken: token
        },
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.status(200).json({ 
    success: true,
    statusCode: 200,
    message: 'Logout successful' 
  });
};