const Joi = require('joi')

const validateProgress = (req, res, next) => {
  const schema = Joi.object({
    contentCompleted: Joi.array().items(Joi.number()).optional(),
    lastAccessedContent: Joi.number().optional(),
    timeSpent: Joi.number().min(0).optional()
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
  validateProgress
}