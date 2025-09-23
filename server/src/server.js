const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const path = require('path')

const connectDB = require('./config/database')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./utils/logger')
const swaggerDocs = require('./config/swagger')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/auth', limiter)

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000' // backup for different dev setups
  ],
  credentials: true,
  optionsSuccessStatus: 200
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static file serving for uploads
app.use('/uploads', express.static('uploads'))

// API routes
app.use('/api', routes)

// Swagger documentation
swaggerDocs(app)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Serve frontend (should be after API routes and Swagger)
const buildPath = path.join(__dirname, '../../client/dist')
app.use(express.static(buildPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

// Error handling middleware
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received')
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`API Documentation: http://localhost:${PORT}/api/docs`)
})

module.exports = app
