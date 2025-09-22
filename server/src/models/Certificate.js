const mongoose = require('mongoose')
const crypto = require('crypto')

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  pdfPath: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
certificateSchema.index({ certificateId: 1 })
certificateSchema.index({ user: 1 })
certificateSchema.index({ course: 1 })

// Generate certificate ID before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString()
    const randomBytes = crypto.randomBytes(8).toString('hex')
    this.certificateId = `LMS-${timestamp}-${randomBytes}`.toUpperCase()
  }
  next()
})

// Virtual for verification URL
certificateSchema.virtual('verificationUrl').get(function() {
  return `${process.env.CLIENT_URL}/verify/${this.certificateId}`
})

module.exports = mongoose.model('Certificate', certificateSchema)