# GovAid-AI Backend API

A powerful Express.js backend API for analyzing government policies using AI. This service provides text extraction, summarization, eligibility checklist generation, and Q&A capabilities.

## 🚀 Features

- **URL Text Extraction**: Extract main content from government policy web pages
- **AI-Powered Summarization**: Generate plain-English summaries of complex policies
- **Eligibility Checklist**: Extract and format eligibility requirements
- **Q&A System**: Ask questions about specific policies
- **Complete Analysis**: One-click full analysis of policy URLs
- **Rate Limiting**: Built-in protection against abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error handling and logging

## 📋 Prerequisites

- Node.js 18+ 
- OpenAI API key
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd GovAid-AI/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## 📚 API Endpoints

### Health Check
```http
GET /api/health
```

### Extract Text from URL
```http
POST /api/extract-text
Content-Type: application/json

{
  "url": "https://example.gov/policy-page"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted policy text...",
    "title": "Policy Page Title",
    "url": "https://example.gov/policy-page"
  }
}
```

### Generate Summary
```http
POST /api/summarize
Content-Type: application/json

{
  "text": "Long policy text to summarize..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Plain English summary...",
    "originalLength": 1500
  }
}
```

### Generate Eligibility Checklist
```http
POST /api/checklist
Content-Type: application/json

{
  "text": "Policy text to analyze for eligibility..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checklist": [
      "Must be 18 years or older",
      "Must be a US citizen",
      "Income below $50,000 annually"
    ],
    "count": 3
  }
}
```

### Complete URL Analysis
```http
POST /api/analyze-url
Content-Type: application/json

{
  "url": "https://example.gov/policy-page"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.gov/policy-page",
    "title": "Policy Page Title",
    "summary": "Plain English summary...",
    "checklist": ["Requirement 1", "Requirement 2"],
    "rawText": "Original extracted text...",
    "metadata": {
      "textLength": 1500,
      "summaryLength": 200,
      "checklistCount": 2
    }
  }
}
```

### Ask a Question
```http
POST /api/ask-question
Content-Type: application/json

{
  "policyText": "Policy text as context...",
  "question": "What are the income requirements?"
}
```

**Response:**
```json
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

### List Available Endpoints
```http
GET /api/endpoints
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### OpenAI Configuration

The API uses GPT-3.5-turbo by default with these settings:
- **Model**: gpt-3.5-turbo
- **Max Tokens**: 2000
- **Temperature**: 0.3 (balanced creativity/accuracy)

## 🧪 Testing

### Using curl

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Extract Text:**
```bash
curl -X POST http://localhost:3001/api/extract-text \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.gov/policy"}'
```

**Complete Analysis:**
```bash
curl -X POST http://localhost:3001/api/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.gov/policy"}'
```

### Using Postman

1. Import the endpoints from `/api/endpoints`
2. Set the base URL to `http://localhost:3001`
3. Use the examples above for request bodies

## 🏗️ Project Structure

```
backend/
├── config/
│   └── config.js          # Configuration and environment variables
├── middleware/
│   ├── errorHandler.js    # Global error handling
│   └── validation.js      # Input validation schemas
├── routes/
│   └── api.js            # API route definitions
├── services/
│   └── openaiService.js  # OpenAI API integration
├── utils/
│   └── textExtractor.js  # URL text extraction utilities
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
└── env.example           # Environment variables template
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Request sanitization
- **Error Handling**: Secure error responses

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": ["Additional error details"]
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `408`: Request Timeout
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## 🔄 Development

### Adding New Endpoints

1. Add validation schema in `middleware/validation.js`
2. Add route handler in `routes/api.js`
3. Update documentation in this README

### Logging

The server logs all requests and errors. In development, you'll see:
- Request timestamps and methods
- Text extraction progress
- AI processing status
- Error details

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
1. Check the error logs
2. Verify your OpenAI API key
3. Test with the health endpoint
4. Review the API documentation at `/api/endpoints` 