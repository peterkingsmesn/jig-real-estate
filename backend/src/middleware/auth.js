const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseFormatter');
const ErrorCodes = require('../utils/errorCodes');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json(
      errorResponse(
        ErrorCodes.UNAUTHORIZED,
        'Not authorized to access this route',
        null,
        req.path
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'User not found',
          null,
          req.path
        )
      );
    }

    if (!user.isActive) {
      return res.status(401).json(
        errorResponse(
          ErrorCodes.UNAUTHORIZED,
          'Account is deactivated',
          null,
          req.path
        )
      );
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json(
      errorResponse(
        ErrorCodes.INVALID_TOKEN,
        'Not authorized to access this route',
        null,
        req.path
      )
    );
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        errorResponse(
          ErrorCodes.INSUFFICIENT_PERMISSIONS,
          'User role is not authorized to access this route',
          null,
          req.path
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };