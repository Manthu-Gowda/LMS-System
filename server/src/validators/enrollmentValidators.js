const Joi = require('joi')

const validateEnrollment = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().required()
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
  validateEnrollment
}