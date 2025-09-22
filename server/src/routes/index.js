const express = require('express')
const authRoutes = require('./auth')
const userRoutes = require('./users')
const courseRoutes = require('./courses')
const enrollmentRoutes = require('./enrollments')
const progressRoutes = require('./progress')
const certificateRoutes = require('./certificates')
const adminRoutes = require('./admin')

const router = express.Router()

// Mount routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/courses', courseRoutes)
router.use('/enrollments', enrollmentRoutes)
router.use('/progress', progressRoutes)
router.use('/certificates', certificateRoutes)
router.use('/admin', adminRoutes)

module.exports = router