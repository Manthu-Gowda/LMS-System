const path = require('path')
const fs = require('fs').promises
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const certificateService = require('../services/certificateService')
const logger = require('../utils/logger')

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { isPublished, difficulty, search, page = 1, limit = 10 } = req.query
    
    const query = {}
    
    // Filter by published status
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true'
    }
    
    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const courses = await Course.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Course.countDocuments(query)

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    logger.error('Get courses error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get course by slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const course = await Course.findOne({ slug, isPublished: true })
      .populate('createdBy', 'name email')

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    res.json({
      success: true,
      data: course
    })
  } catch (error) {
    logger.error('Get course by slug error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Create course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body, createdBy: req.user.userId }

    // Handle thumbnail upload
    if (req.files?.thumbnail) {
      courseData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`
    }

    // Handle content with file uploads
    if (req.body.content) {
      const content = JSON.parse(req.body.content)
      
      // Process each content item
      content.forEach((item, index) => {
        if (item.type === 'video' || item.type === 'pdf') {
          const fileField = `content[${index}].file`
          if (req.files[fileField]) {
            item.url = `/uploads/${req.files[fileField][0].filename}`
          }
        }
      })
      
      courseData.content = content
    }

    // Handle MCQ
    if (req.body.mcq) {
      courseData.mcq = JSON.parse(req.body.mcq)
    }

    // Handle tags
    if (req.body.tags) {
      courseData.tags = JSON.parse(req.body.tags)
    }

    const course = new Course(courseData)
    await course.save()

    await course.populate('createdBy', 'name email')

    logger.info(`Course created: ${course.title} by ${req.user.email}`)

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    })
  } catch (error) {
    logger.error('Create course error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Handle file uploads similar to create
    // ... (implementation similar to createCourse)

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'name email')

    logger.info(`Course updated: ${updatedCourse.title}`)

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    })
  } catch (error) {
    logger.error('Update course error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Delete course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Check if there are enrollments
    const enrollmentCount = await Enrollment.countDocuments({ course: id })
    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete course with active enrollments'
      })
    }

    await Course.findByIdAndDelete(id)

    logger.info(`Course deleted: ${course.title}`)

    res.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    logger.error('Delete course error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get MCQ by course ID
exports.getMCQByCourseId = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({ user: userId, course: id })
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access the quiz'
      })
    }

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Remove correct answers from response
    const mcqQuestions = course.mcq.map(question => ({
      question: question.question,
      options: question.options,
      explanation: question.explanation
    }))

    res.json({
      success: true,
      data: mcqQuestions
    })
  } catch (error) {
    logger.error('Get MCQ error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Submit MCQ
exports.submitMCQ = async (req, res) => {
  try {
    const { id } = req.params
    const { answers } = req.body
    const userId = req.user.userId

    const enrollment = await Enrollment.findOne({ user: userId, course: id })
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course'
      })
    }

    const course = await Course.findById(id)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Calculate score
    let correctAnswers = 0
    course.mcq.forEach((question, index) => {
      if (answers[index] === question.options[question.correctAnswer]) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / course.mcq.length) * 100)

    // Update enrollment
    enrollment.mcqScore = score
    enrollment.mcqAttempts += 1
    await enrollment.save()

    logger.info(`MCQ submitted: User ${userId}, Course ${id}, Score: ${score}%`)

    res.json({
      success: true,
      message: 'MCQ submitted successfully',
      data: {
        score,
        correctAnswers,
        totalQuestions: course.mcq.length,
        passed: score >= 70
      }
    })
  } catch (error) {
    logger.error('Submit MCQ error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params
    const { link, description } = req.body
    const userId = req.user.userId

    const enrollment = await Enrollment.findOne({ user: userId, course: id })
      .populate('course', 'title')
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course'
      })
    }

    // Check if MCQ is passed
    if (!enrollment.mcqScore || enrollment.mcqScore < 70) {
      return res.status(400).json({
        success: false,
        message: 'You must pass the MCQ quiz before submitting assignment'
      })
    }

    // Build assignment data
    const assignmentData = {
      description: description || '',
      submittedAt: new Date(),
      status: 'approved' // Auto-approve for simplicity
    }

    if (link) {
      assignmentData.link = link
    }

    if (req.file) {
      assignmentData.filePath = `/uploads/${req.file.filename}`
    }

    enrollment.assignment = assignmentData
    await enrollment.save()

    // Check if certificate should be generated
    if (enrollment.checkCompletionRequirements() && !enrollment.certificateId) {
      try {
        const certificate = await certificateService.generateCertificate(enrollment._id)
        enrollment.certificateId = certificate._id
        await enrollment.save()
        
        logger.info(`Certificate generated for user ${userId}, course ${id}`)
      } catch (certError) {
        logger.error('Certificate generation error:', certError)
        // Don't fail the assignment submission if certificate generation fails
      }
    }

    logger.info(`Assignment submitted: User ${userId}, Course ${id}`)

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: {
        assignment: assignmentData,
        certificateGenerated: !!enrollment.certificateId
      }
    })
  } catch (error) {
    logger.error('Submit assignment error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}