const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')
const logger = require('../utils/logger')

// Enroll in course
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.userId

    // Check if course exists and is published
    const course = await Course.findById(courseId)
    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available'
      })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId })
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      })
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId
    })

    await enrollment.save()
    await enrollment.populate([
      { path: 'course', select: 'title slug shortDescription difficulty estimatedDuration' },
      { path: 'user', select: 'name email' }
    ])

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } })

    logger.info(`User enrolled: ${userId} in course ${courseId}`)

    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully',
      data: enrollment
    })
  } catch (error) {
    logger.error('Enroll in course error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get my enrollments
exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId

    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'course',
        select: 'title slug shortDescription difficulty estimatedDuration content tags thumbnail'
      })
      .populate('certificateId', 'certificateId issuedAt')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: enrollments
    })
  } catch (error) {
    logger.error('Get my enrollments error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}