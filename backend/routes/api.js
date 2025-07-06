import express from 'express';
import { extractTextFromUrl, isValidUrl } from '../utils/textExtractor.js';
import { 
  generateSummary, 
  generateEligibilityChecklist, 
  answerQuestion, 
  generatePolicyAnalysis 
} from '../services/openaiService.js';

import { validate } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import multer from 'multer';
import path from 'path';
import os from 'os';
// import { extractTextFromPDF, extractTextFromDOCX } from '../utils/fileExtractors.js';
import { detectLanguage, translateText } from '../utils/language.js';

const router = express.Router();

const upload = multer({ dest: os.tmpdir() });

/**
 * @route   POST /api/test-route
 * @desc    Test route to check if routing is working
 * @access  Public
 */
router.post('/test-route', (req, res) => {
  console.log('🔍 TEST ROUTE CALLED');
  res.json({ success: true, message: 'Test route working' });
});

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'GovAid-AI Backend'
    }
  });
});

/**
 * @route   GET /api/endpoints
 * @desc    List all available endpoints
 * @access  Public
 */
router.get('/endpoints', (req, res) => {
  res.json({
    success: true,
    data: {
      endpoints: [
        { method: 'GET', path: '/health', description: 'Health check' },
        { method: 'GET', path: '/endpoints', description: 'List all endpoints' },
        { method: 'POST', path: '/extract-text', description: 'Extract text from URL' },
        { method: 'POST', path: '/summarize', description: 'Generate policy summary' },
        { method: 'POST', path: '/checklist', description: 'Generate eligibility checklist' },
        { method: 'POST', path: '/analyze-url', description: 'Complete URL analysis' },
        { method: 'POST', path: '/ask-question', description: 'Ask question about policy' },
        { method: 'POST', path: '/process-document', description: 'Advanced document processing' },
        { method: 'POST', path: '/upload-file', description: 'Upload and extract from files' }
      ]
    }
  });
});

/**
 * @route   POST /api/extract-text
 * @desc    Extract text content from a URL
 * @access  Public
 */
router.post('/extract-text', 
  validate('extractText'),
  asyncHandler(async (req, res) => {
    const { url } = req.body;

    console.log(`📄 Extracting text from URL: ${url}`);

    try {
      const result = await extractTextFromUrl(url);

      res.json({
        success: true,
        data: {
          text: result.text,
          title: result.title,
          url: url
        }
      });
    } catch (error) {
      console.error(`❌ Error extracting text from ${url}:`, error);
      
      res.status(500).json({
        success: false,
        error: 'Text extraction failed',
        message: error.message || 'An unexpected error occurred while extracting text',
        details: {
          url: url,
          errorType: error.name || 'Unknown',
          timestamp: new Date().toISOString()
        }
      });
    }
  })
);

/**
 * @route   POST /api/summarize
 * @desc    Generate a summary of policy text
 * @access  Public
 */
router.post('/summarize', 
  withTranslation(async (req, res, targetLang) => {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text must be at least 10 characters long'
      });
    }

    console.log(`📝 Generating summary for text (${text.length} characters)`);

    const summary = await generateSummary(text);
    const translated = targetLang !== 'en' ? await translateText(summary, targetLang) : summary;

    res.json({
      success: true,
      data: {
        summary: translated,
        originalLength: text.length,
        translated: targetLang !== 'en',
        targetLanguage: targetLang
      }
    });
  })
);

/**
 * @route   POST /api/checklist
 * @desc    Generate eligibility checklist from policy text
 * @access  Public
 */
router.post('/checklist', 
  withTranslation(async (req, res, targetLang) => {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text must be at least 10 characters long'
      });
    }

    console.log(`✅ Generating eligibility checklist for text (${text.length} characters)`);

    const checklist = await generateEligibilityChecklist(text);
    const translated = targetLang !== 'en' ? await Promise.all(checklist.map(item => translateText(item, targetLang))) : checklist;

    res.json({
      success: true,
      data: {
        checklist: translated,
        count: checklist.length,
        translated: targetLang !== 'en',
        targetLanguage: targetLang
      }
    });
  })
);

/**
 * @route   POST /api/analyze-url
 * @desc    Complete analysis of a URL: extract text, generate summary and checklist
 * @access  Public
 */
router.post('/analyze-url', 
  validate('analyzeUrl'),
  asyncHandler(async (req, res) => {
    const { url } = req.body;

    console.log(`🔍 Starting complete analysis of URL: ${url}`);

    // Step 1: Extract text from URL
    const extractionResult = await extractTextFromUrl(url);
    const { text, title } = extractionResult;

    console.log(`📄 Extracted ${text.length} characters from: ${title}`);

    // Step 2: Generate analysis (summary + checklist) in parallel
    const analysis = await generatePolicyAnalysis(text);

    console.log(`✅ Generated analysis: ${analysis.summary.length} chars summary, ${analysis.checklist.length} checklist items`);

    res.json({
      success: true,
      data: {
        url: url,
        title: title,
        summary: analysis.summary,
        checklist: analysis.checklist,
        rawText: text,
        metadata: {
          textLength: text.length,
          summaryLength: analysis.summary.length,
          checklistCount: analysis.checklist.length
        }
      }
    });
  })
);

/**
 * @route   POST /api/ask-question
 * @desc    Answer a question about a policy using AI
 * @access  Public
 */
router.post('/ask-question', 
  (req, res, next) => {
    console.log('🔍 ASK-QUESTION ROUTE HANDLER CALLED');
    console.log('📝 Request body:', req.body);
    console.log('📝 Request headers:', req.headers);
    console.log('📝 Content-Type:', req.headers['content-type']);
    console.log('📝 Body type:', typeof req.body);
    console.log('📝 Body keys:', req.body ? Object.keys(req.body) : 'No body');
    next();
  },
  (req, res, next) => {
    console.log('🔍 BEFORE VALIDATION MIDDLEWARE');
    console.log('📝 Body before validation:', {
      hasBody: !!req.body,
      policyTextLength: req.body?.policyText?.length || 0,
      questionLength: req.body?.question?.length || 0,
      bodyKeys: req.body ? Object.keys(req.body) : []
    });
    next();
  },
  validate('askQuestion'),
  (req, res, next) => {
    console.log('🔍 AFTER VALIDATION MIDDLEWARE');
    console.log('📝 Body after validation:', {
      policyTextLength: req.body?.policyText?.length || 0,
      questionLength: req.body?.question?.length || 0
    });
    next();
  },
  asyncHandler(async (req, res) => {
    const { policyText, question } = req.body;

    console.log(`❓ Answering question: "${question}" (policy text: ${policyText.length} chars)`);
    console.log(`📝 Policy text preview: "${policyText.substring(0, 100)}..."`);
    console.log(`❓ Question: "${question}"`);

    const answer = await answerQuestion(policyText, question);

    console.log(`💡 Generated answer (${answer.length} characters)`);

    res.json({
      success: true,
      data: {
        question: question,
        answer: answer,
        translated: false,
        targetLanguage: 'en'
      }
    });
  })
);

/**
 * @route   POST /api/upload-file
 * @desc    Upload and extract text from PDF/DOCX files
 * @access  Public
 */
router.post('/upload-file', 
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a file'
      });
    }

    const { filename, path: filePath } = req.file;
    console.log(`📄 Processing uploaded file: ${filename}`);

    try {
      let extractedText = '';

      // Determine file type and extract text
      if (filename.endsWith('.pdf')) {
        extractedText = await extractTextFromPDF(filePath);
      } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
        extractedText = await extractTextFromDOCX(filePath);
      } else {
        return res.status(400).json({
          error: 'Unsupported file type',
          message: 'Please upload a PDF or Word document'
        });
      }

      if (!extractedText || extractedText.trim().length < 10) {
        return res.status(400).json({
          error: 'No text extracted',
          message: 'Could not extract meaningful text from the file'
        });
      }

      console.log(`✅ Extracted ${extractedText.length} characters from ${filename}`);

      res.json({
        success: true,
        data: {
          text: extractedText,
          filename: filename
        }
      });

    } catch (error) {
      console.error('Error processing uploaded file:', error);
      res.status(500).json({
        error: 'File processing failed',
        message: 'Failed to extract text from the uploaded file'
      });
    }
  })
);

/**
 * @route   POST /api/process-document
 * @desc    Advanced document processing (analyze and generate insights)
 * @access  Public
 */
router.post('/process-document', 
  asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text must be at least 10 characters long'
      });
    }

    console.log(`📄 Processing document (${text.length} characters)`);

    // Generate summary and checklist
    const [summary, checklist] = await Promise.all([
      generateSummary(text),
      generateEligibilityChecklist(text)
    ]);

    console.log(`✅ Processed document: ${summary.length} chars summary, ${checklist.length} requirements`);

    res.json({
      success: true,
      data: {
        summary: summary,
        checklist: checklist,
        metadata: {
          originalLength: text.length,
          summaryLength: summary.length,
          checklistCount: checklist.length,
          method: 'direct_api'
        }
      }
    });
  })
);

/**
 * @route   POST /api/upload-document
 * @desc    Upload a PDF or DOCX, extract text, and run analysis pipeline
 * @access  Public
 */
router.post('/upload-document', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const ext = path.extname(req.file.originalname).toLowerCase();
  let text = '';
  if (ext === '.pdf') {
    text = await extractTextFromPDF(req.file.path);
  } else if (ext === '.docx') {
    text = await extractTextFromDOCX(req.file.path);
  } else {
    return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are supported.' });
  }
  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: 'No extractable text found in document.' });
  }
  // Language detection and translation
  const targetLang = req.body.language || 'es';
  const detectedLang = detectLanguage(text);
  // Run pipeline
  const [summary, checklist] = await Promise.all([
    generateSummary(text),
    generateEligibilityChecklist(text)
  ]);
  // Translate outputs if needed
  const translatedSummary = targetLang !== 'en' ? await translateText(summary, targetLang) : summary;
  const translatedChecklist = targetLang !== 'en' ? await Promise.all(checklist.map(item => translateText(item, targetLang))) : checklist;
  res.json({
    success: true,
    data: {
      detectedLanguage: detectedLang,
      summary: translatedSummary,
      checklist: translatedChecklist,
      rawText: text,
      metadata: {
        fileName: req.file.originalname,
        fileType: ext,
        textLength: text.length,
        summaryLength: summary.length,
        checklistCount: checklist.length,
        translated: targetLang !== 'en',
        targetLanguage: targetLang
      }
    }
  });
}));

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'GovAid-AI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * @route   GET /api/endpoints
 * @desc    List available API endpoints
 * @access  Public
 */
router.get('/endpoints', (req, res) => {
  res.json({
    success: true,
    data: {
      endpoints: [
        {
          method: 'POST',
          path: '/api/extract-text',
          description: 'Extract text content from a URL',
          body: { url: 'string' }
        },
        {
          method: 'POST',
          path: '/api/summarize',
          description: 'Generate a summary of policy text (using LangChain)',
          body: { text: 'string' }
        },
        {
          method: 'POST',
          path: '/api/checklist',
          description: 'Generate eligibility checklist from policy text (using LangChain)',
          body: { text: 'string' }
        },
        {
          method: 'POST',
          path: '/api/analyze-url',
          description: 'Complete analysis of a URL (extract, summarize, checklist)',
          body: { url: 'string' }
        },
        {
          method: 'POST',
          path: '/api/ask-question',
          description: 'Answer a question about a policy (using LangChain RetrievalQAChain)',
          body: { policyText: 'string', question: 'string' }
        },
        {
          method: 'POST',
          path: '/api/process-document',
          description: 'Advanced document processing with LangChain (split, analyze chunks)',
          body: { text: 'string' }
        },
        {
          method: 'GET',
          path: '/api/health',
          description: 'Health check endpoint'
        }
      ],
      features: {
        langchain: {
          enabled: true,
          capabilities: [
            'Document chunking and splitting',
            'Vector-based question answering',
            'Chunk-based summarization',
            'Advanced text processing'
          ]
        }
      }
    }
  });
});

function withTranslation(handler) {
  return asyncHandler(async (req, res, next) => {
    const targetLang = req.body.language || req.query.language || 'en';
    const result = await handler(req, res, targetLang);
    if (result !== undefined) res.json(result);
  });
}

export default router; 