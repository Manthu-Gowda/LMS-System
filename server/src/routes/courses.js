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

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */
router.get('/', courseController.getAllCourses)

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create new course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - description
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 *       403:
 *         description: Access denied
 */
router.post('/', 
  auth, 
  authorize(['admin']), 
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'content', maxCount: 20 }
  ]), 
  validateCourse, 
  courseController.createCourse
)

/**
 * @swagger
 * /courses/{slug}:
 *   get:
 *     summary: Get course by slug
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get('/:slug', auth, courseController.getCourseBySlug)

/**
 * @swagger
 * /courses/{id}/mcq:
 *   get:
 *     summary: Get MCQ questions for course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: MCQ questions retrieved successfully
 *       403:
 *         description: Not enrolled in course
 */
router.get('/:id/mcq', auth, courseController.getMCQByCourseId)

/**
 * @swagger
 * /courses/{id}/mcq/submit:
 *   post:
 *     summary: Submit MCQ answers
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: object
 *     responses:
 *       200:
 *         description: MCQ submitted successfully
 *       400:
 *         description: Invalid submission
 */
router.post('/:id/mcq/submit', auth, courseController.submitMCQ)

/**
 * @swagger
 * /courses/{id}/assignment:
 *   post:
 *     summary: Submit assignment
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Assignment submitted successfully
 *       400:
 *         description: Invalid submission
 */
router.post('/:id/assignment', 
  auth, 
  upload.single('file'), 
  courseController.submitAssignment
)

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       403:
 *         description: Access denied
 */
router.patch('/:id', 
  auth, 
  authorize(['admin']), 
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'content', maxCount: 20 }
  ]), 
  validateCourse, 
  courseController.updateCourse
)

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete course (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Access denied
 */
router.delete('/:id', auth, authorize(['admin']), courseController.deleteCourse)

module.exports = router