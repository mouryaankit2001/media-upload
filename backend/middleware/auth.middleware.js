const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const { sendUnauthorized, sendForbidden } = require('../utils/responseHandler');
const config = require('../config/config');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check token exists
    if (!token) {
      return sendUnauthorized(res, 'Access denied. Please log in to continue');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendUnauthorized(res, 'User no longer exists');
    }

    // Set user on request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token. Please log in again');
    }
    
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Your session has expired. Please log in again');
    }
    
    return next(new AppError('Authentication failed', 401));
  }
};

/**
 * Middleware to restrict access to specific roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendForbidden(res, 'You do not have permission to perform this action');
    }
    next();
  };
}; 