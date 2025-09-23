const Enrollment = require('../models/Enrollment');
const logger = require('../utils/logger');

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { contentCompleted, lastAccessedContent, timeSpent } = req.body;
    const userId = req.user.userId;

    const enrollment = await Enrollment.findOne({ _id: enrollmentId, user: userId });
    if (!enrollment) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Enrollment not found'
      });
    }

    // Update progress
    if (contentCompleted !== undefined) {
      enrollment.progress.contentCompleted = contentCompleted;
    }
    
    if (lastAccessedContent !== undefined) {
      enrollment.progress.lastAccessedContent = lastAccessedContent;
    }
    
    if (timeSpent !== undefined) {
      enrollment.progress.timeSpent = timeSpent;
    }

    await enrollment.save();

    logger.info(`Progress updated: User ${userId}, Enrollment ${enrollmentId}`);

    res.status(200).json({
      statusCode: 200,
      message: 'Progress updated successfully',
      data: enrollment.progress
    });
  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
};