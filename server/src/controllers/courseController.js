const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const certificateService = require('../services/certificateService');
const logger = require('../utils/logger');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { isPublished, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const courses = await Course.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      statusCode: 200,
      message: 'Courses fetched successfully',
      data: courses, // Return courses directly for frontend compatibility
      pagination: { 
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get courses error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Get course by slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug })
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({ statusCode: 404, message: 'Course not found' });
    }

    res.status(200).json({ 
      statusCode: 200,
      message: 'Course fetched successfully',
      data: course 
    });
  } catch (error) {
    logger.error('Get course by slug error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Get course by ID (Admin only)
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({ statusCode: 404, message: 'Course not found' });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Course fetched successfully',
      data: course
    });
  } catch (error) {
    logger.error('Get course by ID error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Create course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const courseData = { ...req.body, createdBy: req.user.userId };

    if (req.files?.thumbnail) {
      courseData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    if (req.body.content) {
      courseData.content = JSON.parse(req.body.content);
      courseData.content.forEach((item, index) => {
        const fileField = `content[${index}][file]`;
        if (req.files && req.files[fileField]) {
          item.url = `/uploads/${req.files[fileField][0].filename}`;
        }
      });
    }
    
    const course = new Course(courseData);
    await course.save();

    await course.populate('createdBy', 'name email');

    logger.info(`Course created: ${course.title} by ${req.user.email}`);

    res.status(201).json({
      statusCode: 201,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ statusCode: 404, message: 'Course not found' });
    }

    if (req.files?.thumbnail) {
      updateData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    if (req.body.content) {
        updateData.content = JSON.parse(req.body.content);
        updateData.content.forEach((item, index) => {
        const fileField = `content[${index}][file]`;
        if (req.files && req.files[fileField]) {
          item.url = `/uploads/${req.files[fileField][0].filename}`;
        }
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'name email');

    logger.info(`Course updated: ${updatedCourse.title}`);

    res.status(200).json({
      statusCode: 200,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    logger.error('Update course error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Delete course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ statusCode: 404, message: 'Course not found' });
    }

    const enrollmentCount = await Enrollment.countDocuments({ course: id });
    if (enrollmentCount > 0) {
      return res.status(400).json({ statusCode: 400, message: 'Cannot delete course with active enrollments' });
    }

    await Course.findByIdAndDelete(id);

    logger.info(`Course deleted: ${course.title}`);

    res.status(200).json({ statusCode: 200, message: 'Course deleted successfully' });
  } catch (error) {
    logger.error('Delete course error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Get MCQ by course ID
exports.getMCQByCourseId = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({ user: userId, course: id });
    if (!enrollment) {
      return res.status(403).json({ statusCode: 403, message: 'You must be enrolled in this course to access the quiz' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ statusCode: 404, message: 'Course not found' });
    }

    const mcqQuestions = course.mcq.map(question => ({
      question: question.question,
      options: question.options,
      explanation: question.explanation
    }));

    res.status(200).json({ 
      statusCode: 200,
      message: 'MCQ questions fetched successfully',
      data: mcqQuestions 
    });
  } catch (error) {
    logger.error('Get MCQ error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Submit MCQ
exports.submitMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({ user: userId, course: id });
    if (!enrollment) {
      return res.status(403).json({ statusCode: 403, message: 'You must be enrolled in this course' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ statusCode: 404, message: 'Course not found' });
    }

    let correctAnswers = 0;
    course.mcq.forEach((question, index) => {
      if (answers[index] === question.options[question.correctAnswer]) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / course.mcq.length) * 100);

    enrollment.mcqScore = score;
    enrollment.mcqAttempts += 1;
    await enrollment.save();

    logger.info(`MCQ submitted: User ${userId}, Course ${id}, Score: ${score}%`);

    res.status(200).json({
      statusCode: 200,
      message: 'MCQ submitted successfully',
      data: {
        score,
        correctAnswers,
        totalQuestions: course.mcq.length,
        passed: score >= 70
      }
    });
  } catch (error) {
    logger.error('Submit MCQ error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, description } = req.body;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({ user: userId, course: id })
      .populate('course', 'title');
    if (!enrollment) {
      return res.status(403).json({ statusCode: 403, message: 'You must be enrolled in this course' });
    }

    if (!enrollment.mcqScore || enrollment.mcqScore < 70) {
      return res.status(400).json({ statusCode: 400, message: 'You must pass the MCQ quiz before submitting assignment' });
    }

    const assignmentData = {
      description: description || '',
      submittedAt: new Date(),
      status: 'approved' // Auto-approve for simplicity
    };

    if (link) {
      assignmentData.link = link;
    }

    if (req.file) {
      assignmentData.filePath = `/uploads/${req.file.filename}`;
    }

    enrollment.assignment = assignmentData;
    await enrollment.save();

    // Check if certificate should be generated
    if (enrollment.checkCompletionRequirements() && !enrollment.certificateId) {
      try {
        const certificate = await certificateService.generateCertificate(enrollment._id);
        enrollment.certificateId = certificate._id;
        await enrollment.save();
        
        logger.info(`Certificate generated for user ${userId}, course ${id}`);
      } catch (certError) {
        logger.error('Certificate generation error:', certError);
      }
    }

    logger.info(`Assignment submitted: User ${userId}, Course ${id}`);

    res.status(200).json({
      statusCode: 200,
      message: 'Assignment submitted successfully',
      data: {
        assignment: assignmentData,
        certificateGenerated: !!enrollment.certificateId
      }
    });
  } catch (error) {
    logger.error('Submit assignment error:', error);
    res.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
};