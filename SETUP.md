# GovAid-AI Complete Setup Guide

This guide will help you set up both the frontend and backend for the GovAid-AI project.

## 🏗️ Project Structure

```
GovAid-AI/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # Express.js backend
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── package.json
│   └── ...
└── README.md
```

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Git** - For version control
- **npm or yarn** - Package managers

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd GovAid-AI

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

#### Backend Setup
```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Setup (if needed)
The frontend should already be configured to connect to `http://localhost:3001`.

### 3. Start the Servers

#### Option A: Manual Start
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
npm run dev
```

#### Option B: Windows Batch File
```bash
# Start backend (Windows)
cd backend
start-dev.bat

# Start frontend (in another terminal)
npm run dev
```

### 4. Verify Installation

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

## 🔧 Backend API Features

### ✅ Implemented Features

1. **URL Text Extraction** (`POST /api/extract-text`)
   - Extracts main content from government policy web pages
   - Uses Cheerio for HTML parsing
   - Handles various content selectors

2. **AI-Powered Summarization** (`POST /api/summarize`)
   - Generates plain-English summaries using GPT-3.5-turbo
   - Focuses on key points and benefits
   - Optimized for government policy content

3. **Eligibility Checklist Generation** (`POST /api/checklist`)
   - Extracts eligibility requirements from policy text
   - Formats as clear bullet points
   - Uses AI to identify qualification criteria

4. **Complete URL Analysis** (`POST /api/analyze-url`)
   - One-click full analysis of policy URLs
   - Combines text extraction, summarization, and checklist generation
   - Returns comprehensive policy breakdown

5. **Q&A System** (`POST /api/ask-question`)
   - Ask specific questions about policies
   - Uses policy text as context
   - Provides accurate, contextual answers

### 🛡️ Security & Reliability

- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error responses
- **CORS**: Configured for frontend access
- **Security Headers**: Helmet.js protection

## 🧪 Testing the Backend

### Quick Test
```bash
cd backend
npm test
```

### Manual Testing with curl
```bash
# Health check
curl http://localhost:3001/api/health

# Extract text from URL
curl -X POST http://localhost:3001/api/extract-text \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.ssa.gov/benefits/retirement/planner/retirechart.html"}'

# Complete analysis
curl -X POST http://localhost:3001/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.ssa.gov/benefits/retirement/planner/retirechart.html"}'
```

### Using Postman
1. Import the collection from `/api/endpoints`
2. Set base URL to `http://localhost:3001`
3. Test each endpoint with sample data

## 🔗 Frontend Integration

The frontend is already configured to work with the backend. Key integration points:

### API Service
```javascript
// Example usage in React components
const API_BASE_URL = 'http://localhost:3001/api';

// Analyze a policy URL
const response = await fetch(`${API_BASE_URL}/analyze-url`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.gov/policy' })
});

const result = await response.json();
console.log(result.data);
```

### Available Endpoints for Frontend
- `POST /api/analyze-url` - Main analysis endpoint
- `POST /api/ask-question` - Q&A functionality
- `POST /api/extract-text` - Text extraction only
- `POST /api/summarize` - Summary generation only
- `POST /api/checklist` - Checklist generation only

## 🚨 Troubleshooting

### Common Issues

1. **"Missing OpenAI API key"**
   - Ensure `.env` file exists in `backend/` directory
   - Verify API key is valid and has credits

2. **"CORS errors"**
   - Check that frontend URL matches `FRONTEND_URL` in `.env`
   - Ensure both servers are running

3. **"Rate limit exceeded"**
   - Wait 15 minutes or increase limits in `.env`
   - Check request frequency

4. **"Invalid URL"**
   - Ensure URL is properly formatted
   - Check if website is accessible

### Debug Mode
```bash
# Enable detailed logging
cd backend
NODE_ENV=development npm run dev
```

### Check Server Status
```bash
# Backend health
curl http://localhost:3001/api/health

# Frontend (should show React app)
curl http://localhost:5173
```

## 📚 API Documentation

### Request/Response Examples

#### Analyze URL
```json
// Request
POST /api/analyze-url
{
  "url": "https://www.ssa.gov/benefits/retirement/planner/retirechart.html"
}

// Response
{
  "success": true,
  "data": {
    "url": "https://www.ssa.gov/benefits/retirement/planner/retirechart.html",
    "title": "Retirement Benefits",
    "summary": "This policy provides retirement benefits...",
    "checklist": [
      "Must be 62 years or older",
      "Must have worked for at least 10 years",
      "Must be a US citizen"
    ],
    "rawText": "Original extracted text...",
    "metadata": {
      "textLength": 1500,
      "summaryLength": 200,
      "checklistCount": 3
    }
  }
}
```

#### Ask Question
```json
// Request
POST /api/ask-question
{
  "policyText": "Policy text content...",
  "question": "What are the income requirements?"
}

// Response
{
  "success": true,
  "data": {
    "question": "What are the income requirements?",
    "answer": "Based on the policy, the income requirements are...",
    "metadata": {
      "policyTextLength": 1500,
      "answerLength": 150
    }
  }
}
```

## 🔄 Development Workflow

1. **Start both servers** (frontend + backend)
2. **Make changes** to either frontend or backend
3. **Test endpoints** using the test script or Postman
4. **Update frontend** to use new backend features
5. **Commit changes** with descriptive messages

## 📝 Next Steps

After setup, you can:

1. **Test all endpoints** with real government policy URLs
2. **Customize prompts** in `backend/services/openaiService.js`
3. **Add new features** following the existing patterns
4. **Deploy to production** (see deployment guide)
5. **Add authentication** if needed
6. **Implement caching** for better performance

## 🆘 Support

If you encounter issues:

1. Check the console logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Test individual endpoints with curl or Postman
4. Check the API documentation at `/api/endpoints`
5. Review the troubleshooting section above

---

**Happy coding! 🚀** 