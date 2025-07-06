import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GovAid-AI API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: '/api/endpoints',
      extractText: 'POST /api/extract-text',
      summarize: 'POST /api/summarize',
      checklist: 'POST /api/checklist',
      analyzeUrl: 'POST /api/analyze-url',
      askQuestion: 'POST /api/ask-question'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: '/api/endpoints'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log('🚀 GovAid-AI Backend Server Started');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.cors.origin}`);
  console.log(`📊 Rate Limit: ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs / 1000 / 60} minutes`);
  console.log('📋 Available endpoints:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/endpoints');
  console.log('   POST /api/extract-text');
  console.log('   POST /api/summarize');
  console.log('   POST /api/checklist');
  console.log('   POST /api/analyze-url');
  console.log('   POST /api/ask-question');
  console.log('');
  console.log('✨ Ready to process government policy analysis requests!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 