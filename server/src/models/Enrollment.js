const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
  contentCompleted: [{
    type: Number, // Index of completed content items
    default: []
  }],
  lastAccessedContent: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // Total time in minutes
    default: 0
  }
})

const assignmentSchema = new mongoose.Schema({
  link: String, // Project link (GitHub, demo, etc.)
  filePath: String, // Uploaded file path
  description: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // Auto-approve for simplicity
  },
  feedback: String
})

const enrollmentSchema = new mongoose.Schema({
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
  progress: {
    type: progressSchema,
    default: () => ({})
  },
  mcqScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  mcqAttempts: {
    type: Number,
    default: 0
  },
  assignment: assignmentSchema,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    default: null
  }
}, {
  timestamps: true
})

// Compound index for user-course uniqueness
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true })

// Indexes for queries
enrollmentSchema.index({ user: 1 })
enrollmentSchema.index({ course: 1 })
enrollmentSchema.index({ isCompleted: 1 })

// Method to check if course requirements are met for certificate
enrollmentSchema.methods.checkCompletionRequirements = function() {
  // Requirements: MCQ passed (>=70%) AND assignment submitted
  const mcqPassed = this.mcqScore !== null && this.mcqScore >= 70
  const assignmentSubmitted = this.assignment && this.assignment.status === 'approved'
  
  return mcqPassed && assignmentSubmitted
}

// Auto-update completion status
enrollmentSchema.pre('save', function(next) {
  if (this.checkCompletionRequirements() && !this.isCompleted) {
    this.isCompleted = true
    this.completedAt = new Date()
  }
  next()
})

module.exports = mongoose.model('Enrollment', enrollmentSchema)