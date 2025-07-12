const logger = require('../utils/logger');
const { errorResponse } = require('../utils/responseFormatter');
const ErrorCodes = require('../utils/errorCodes');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Mongoose 검증 오류
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(
      errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        errors,
        req.path
      )
    );
  }

  // Mongoose CastError (잘못된 ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json(
      errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid ID format',
        null,
        req.path
      )
    );
  }

  // MongoDB 중복 키 오류
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json(
      errorResponse(
        ErrorCodes.DUPLICATE_RESOURCE,
        `${field} already exists`,
        null,
        req.path
      )
    );
  }

  // JWT 오류
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      errorResponse(
        ErrorCodes.INVALID_TOKEN,
        'Invalid token',
        null,
        req.path
      )
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      errorResponse(
        ErrorCodes.TOKEN_EXPIRED,
        'Token expired',
        null,
        req.path
      )
    );
  }

  // 기본 에러 응답
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || ErrorCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json(
    errorResponse(code, message, null, req.path)
  );
};

module.exports = errorHandler;