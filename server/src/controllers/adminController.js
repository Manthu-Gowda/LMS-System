const User = require('../models/User')
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const Certificate = require('../models/Certificate')
const logger = require('../utils/logger')

// Get admin dashboard overview
exports.getOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalCertificates,
      recentEnrollments
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Certificate.countDocuments({ isValid: true }),
      Enrollment.find()
        .populate('user', 'name email')
        .populate('course', 'title')
        .sort({ createdAt: -1 })
        .limit(10)
    ])

    res.status(200).json({
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalCertificates,
        recentEnrollments
      }
    })
  } catch (error) {
    logger.error('Get admin overview error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
}

// Get user progress details
exports.getUserProgress = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpires')
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const enrollments = await Enrollment.find({ user: id })
      .populate({
        path: 'course',
        select: 'title slug difficulty content estimatedDuration'
      })
      .populate('certificateId', 'certificateId issuedAt')
      .sort({ createdAt: -1 })

    res.status(200).json({
      data: {
        user,
        enrollments
      }
    })
  } catch (error) {
    logger.error('Get user progress error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
}