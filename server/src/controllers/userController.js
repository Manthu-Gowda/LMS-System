const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const logger = require('../utils/logger');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    
    const query = { role: { $ne: 'admin' } }; // Exclude admin users
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const usersWithEnrollments = await Promise.all(
      users.map(async (user) => {
        const enrollments = await Enrollment.find({ user: user._id })
          .populate('course', 'title');
        
        return {
          ...user.toJSON(),
          enrollments
        };
      })
    );

    const total = await User.countDocuments(query);

    res.status(200).json({
      statusCode: 200,
      message: 'Users fetched successfully',
      data: usersWithEnrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.user.userId;
    const requestingUserRole = req.user.role;

    if (requestingUserRole !== 'admin' && id !== requestingUserId) {
      return res.status(403).json({ statusCode: 403, message: 'Access denied' });
    }

    const user = await User.findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const enrollments = await Enrollment.find({ user: id })
      .populate('course', 'title slug')
      .populate('certificateId', 'certificateId issuedAt');

    res.status(200).json({
      statusCode: 200,
      message: 'User data fetched successfully',
      data: {
        user,
        enrollments
      }
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};