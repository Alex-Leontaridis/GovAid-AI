// Frontend Integration Examples for GovAid-AI Backend
// This file shows how to integrate the React frontend with the backend API

const API_BASE_URL = 'http://localhost:3001/api';

// Example API service class
class GovAidAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Extract text from URL
  async extractText(url) {
    return this.makeRequest('/extract-text', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // Generate summary from text
  async summarize(text) {
    return this.makeRequest('/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Generate eligibility checklist
  async generateChecklist(text) {
    return this.makeRequest('/checklist', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Complete URL analysis
  async analyzeUrl(url) {
    return this.makeRequest('/analyze-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // Ask a question about a policy
  async askQuestion(policyText, question) {
    return this.makeRequest('/ask-question', {
      method: 'POST',
      body: JSON.stringify({ policyText, question }),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

// Example React hooks for the frontend
const useGovAidAPI = () => {
  const api = new GovAidAPI();

  const extractText = async (url) => {
    try {
      const result = await api.extractText(url);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const analyzeUrl = async (url) => {
    try {
      const result = await api.analyzeUrl(url);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const askQuestion = async (policyText, question) => {
    try {
      const result = await api.askQuestion(policyText, question);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    extractText,
    analyzeUrl,
    askQuestion,
  };
};

// Example React component usage
const ExampleComponent = () => {
  const { analyzeUrl, askQuestion } = useGovAidAPI();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyzeUrl = async (url) => {
    setLoading(true);
    setError(null);
    
    const response = await analyzeUrl(url);
    
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  };

  const handleAskQuestion = async (policyText, question) => {
    setLoading(true);
    setError(null);
    
    const response = await askQuestion(policyText, question);
    
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {result && (
        <div>
          <h3>Analysis Result:</h3>
          <p><strong>Summary:</strong> {result.summary}</p>
          <p><strong>Eligibility Requirements:</strong></p>
          <ul>
            {result.checklist?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Example usage with fetch directly
const exampleUsage = async () => {
  // 1. Analyze a government policy URL
  try {
    const analysisResponse = await fetch(`${API_BASE_URL}/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.ssa.gov/benefits/retirement/planner/retirechart.html'
      })
    });
    
    const analysis = await analysisResponse.json();
    console.log('Policy Analysis:', analysis.data);
    
    // 2. Ask a question about the policy
    const questionResponse = await fetch(`${API_BASE_URL}/ask-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        policyText: analysis.data.rawText,
        question: 'What is the minimum age to start receiving benefits?'
      })
    });
    
    const answer = await questionResponse.json();
    console.log('Question Answer:', answer.data);
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// Export for use in frontend
export { GovAidAPI, useGovAidAPI, ExampleComponent, exampleUsage }; 