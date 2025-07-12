const { errorResponse } = require('../utils/responseFormatter');
const ErrorCodes = require('../utils/errorCodes');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json(
        errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed',
          errors,
          req.path
        )
      );
    }
    
    next();
  };
};

module.exports = validate;