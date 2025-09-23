const express = require('express')
const courseController = require('../controllers/courseController')
const { auth, authorize } = require('../middleware/auth')
const upload = require('../middleware/upload')
const { validateCourse } = require('../validators/courseValidators')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

// Get all courses (public for browsing, but enrollment requires auth)
router.get('/', courseController.getAllCourses)

// Create new course (Admin only)
router.post('/', 
  auth, 
  authorize(['admin']), 
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'content[0].file', maxCount: 1 },
    { name: 'content[1].file', maxCount: 1 },
    { name: 'content[2].file', maxCount: 1 },
    { name: 'content[3].file', maxCount: 1 },
    { name: 'content[4].file', maxCount: 1 },
    { name: 'content[5].file', maxCount: 1 },
    { name: 'content[6].file', maxCount: 1 },
    { name: 'content[7].file', maxCount: 1 },
    { name: 'content[8].file', maxCount: 1 },
    { name: 'content[9].file', maxCount: 1 }
  ]), 
  courseController.createCourse
)

// Get course by slug (requires auth for enrolled users)
router.get('/:slug', auth, courseController.getCourseBySlug)

// Get course by ID (for admin)
router.get('/id/:id', auth, authorize(['admin']), courseController.getCourseById)

// Get MCQ questions for course
router.get('/:id/mcq', auth, courseController.getMCQByCourseId)

// Submit MCQ answers
router.post('/:id/mcq/submit', auth, courseController.submitMCQ)

// Submit assignment
router.post('/:id/assignment', 
  auth, 
  upload.single('file'), 
  courseController.submitAssignment
)

// Update course (Admin only)
router.patch('/:id', 
  auth, 
  authorize(['admin']), 
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'content[0].file', maxCount: 1 },
    { name: 'content[1].file', maxCount: 1 },
    { name: 'content[2].file', maxCount: 1 },
    { name: 'content[3].file', maxCount: 1 },
    { name: 'content[4].file', maxCount: 1 },
    { name: 'content[5].file', maxCount: 1 },
    { name: 'content[6].file', maxCount: 1 },
    { name: 'content[7].file', maxCount: 1 },
    { name: 'content[8].file', maxCount: 1 },
    { name: 'content[9].file', maxCount: 1 }
  ]), 
  courseController.updateCourse
)

// Delete course (Admin only)
router.delete('/:id', auth, authorize(['admin']), courseController.deleteCourse)

module.exports = router