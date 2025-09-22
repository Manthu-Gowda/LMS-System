const Joi = require('joi')

const validateCourse = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    shortDescription: Joi.string().min(10).max(200).required(),
    description: Joi.string().min(50).max(2000).required(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    estimatedDuration: Joi.string().required(),
    tags: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ).optional(),
    isPublished: Joi.boolean().optional(),
    content: Joi.alternatives().try(
      Joi.array().items(Joi.object({
        title: Joi.string().required(),
        type: Joi.string().valid('video', 'pdf', 'youtube', 'text').required(),
        url: Joi.string().optional(),
        content: Joi.string().optional(),
        description: Joi.string().optional()
      })),
      Joi.string()
    ).optional(),
    mcq: Joi.alternatives().try(
      Joi.array().items(Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).length(4).required(),
        correctAnswer: Joi.number().min(0).max(3).required(),
        explanation: Joi.string().optional()
      })),
      Joi.string()
    ).optional()
  })

  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    })
  }

  next()
}

module.exports = {
  validateCourse
}