/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Log request details for debugging
  console.error('Request URL:', req.url);
  console.error('Request Method:', req.method);
  console.error('Request Body:', req.body);

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || []
    });
  }

  if (err.name === 'OpenAIError') {
    return res.status(500).json({
      error: 'AI Service Error',
      message: 'Failed to process request with AI service. Please try again.',
      details: err.message
    });
  }

  if (err.code === 'ENOTFOUND') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found'
    });
  }

  if (err.code === 'ECONNABORTED') {
    return res.status(408).json({
      error: 'Request Timeout',
      message: 'The request took too long to complete'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: 'Server Error',
    message: statusCode === 500 ? 'An unexpected error occurred' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Async error wrapper to catch async errors in route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} - Wrapped function that catches async errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Custom error class for OpenAI errors
 */
export class OpenAIError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'OpenAIError';
    this.details = details;
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
} 