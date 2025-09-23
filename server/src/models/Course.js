const mongoose = require('mongoose');
const slugify = require('slugify'); // Import slugify

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'youtube', 'text'],
    required: true
  },
  url: String, // For uploaded files or YouTube links
  content: String, // For text content
  description: String,
  duration: String, // Estimated duration
  order: {
    type: Number,
    default: 0
  }
});

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: String
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    unique: true, // Titles should be unique to avoid slug conflicts
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  content: [contentSchema],
  mcq: [mcqSchema],
  estimatedDuration: {
    type: String,
    required: true,
    default: '1-2 hours'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ difficulty: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ createdBy: 1 });

// Generate slug from title before saving
courseSchema.pre('save', function(next) {
  // Only generate a new slug if the title has changed
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Virtual for content count
courseSchema.virtual('contentCount').get(function() {
  return this.content ? this.content.length : 0;
});

// Virtual for MCQ count
courseSchema.virtual('mcqCount').get(function() {
  return this.mcq ? this.mcq.length : 0;
});

module.exports = mongoose.model('Course', courseSchema);
