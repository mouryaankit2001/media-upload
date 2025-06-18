/**
 * Standard response formatter for success responses
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object|Array} data - Response data
 * @returns {Object} Formatted response
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standard response for created resource
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Created resource data
 * @returns {Object} Formatted response
 */
const sendCreated = (res, message = 'Resource created successfully', data = null) => {
  return sendSuccess(res, 201, message, data);
};

/**
 * Standard response for unauthorized
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @returns {Object} Formatted response
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Standard response for forbidden
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @returns {Object} Formatted response
 */
const sendForbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    message
  });
};

/**
 * Standard response for not found
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @returns {Object} Formatted response
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

/**
 * Standard response for validation errors
 * @param {Object} res - Express response object
 * @param {String|Object} errors - Validation errors
 * @returns {Object} Formatted response
 */
const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendValidationError
}; 