import Joi from 'joi';

// Validation schemas
const schemas = {
  extractText: Joi.object({
    url: Joi.string().uri({
      scheme: ['http', 'https']
    }).required().messages({
      'string.uri': 'Please provide a valid URL starting with http:// or https://',
      'any.required': 'URL is required',
      'string.empty': 'URL cannot be empty'
    })
  }),

  analyzeUrl: Joi.object({
    url: Joi.string().uri({
      scheme: ['http', 'https']
    }).required().messages({
      'string.uri': 'Please provide a valid URL starting with http:// or https://',
      'any.required': 'URL is required',
      'string.empty': 'URL cannot be empty'
    })
  }),

  askQuestion: Joi.object({
    policyText: Joi.string().min(1).required().messages({
      'string.min': 'Government aid policy text must be at least 1 character long',
      'any.required': 'Government aid policy text is required',
      'string.empty': 'Government aid policy text cannot be empty'
    }),
    question: Joi.string().min(1).required().messages({
      'string.min': 'Question must be at least 1 character long',
      'any.required': 'Question is required',
      'string.empty': 'Question cannot be empty'
    })
  })
};

/**
 * Generic validation middleware
 * @param {string} schemaName - Name of the schema to use
 * @returns {Function} - Express middleware function
 */
export function validate(schemaName) {
  return (req, res, next) => {
    console.log(`🔍 VALIDATION MIDDLEWARE CALLED for ${schemaName}`);
    console.log(`🔍 Available schemas:`, Object.keys(schemas));
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        error: 'Validation schema not found'
      });
    }

    // Ensure req.body exists
    if (!req.body) {
      console.log('❌ No request body found');
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Request body is required',
        details: ['No request body provided']
      });
    }

    console.log(`🔍 Validating ${schemaName}:`, {
      policyTextLength: req.body.policyText?.length || 0,
      questionLength: req.body.question?.length || 0,
      hasPolicyText: !!req.body.policyText,
      hasQuestion: !!req.body.question,
      bodyKeys: Object.keys(req.body),
      contentType: req.headers['content-type']
    });

    console.log(`📝 Raw request body:`, JSON.stringify(req.body, null, 2));

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true
    });

    if (error) {
      console.log('❌ Validation error:', error.details);
      return res.status(400).json({
        error: 'Validation failed',
        message: error.details[0].message,
        details: error.details.map(detail => detail.message)
      });
    }

    console.log(`✅ Validation passed for ${schemaName}`);
    
    // Replace req.body with validated data
    req.body = value;
    next();
  };
}

/**
 * Validate URL parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function validateUrlParam(req, res, next) {
  const urlSchema = Joi.string().uri().required();
  const { error } = urlSchema.validate(req.params.url);

  if (error) {
    return res.status(400).json({
      error: 'Invalid URL parameter',
      details: error.details.map(detail => detail.message)
    });
  }

  next();
} 