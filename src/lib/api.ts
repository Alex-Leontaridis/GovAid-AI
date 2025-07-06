const API_BASE_URL = 'http://localhost:3001/api';

// Types for API responses
export interface AnalysisResult {
  url?: string;
  title?: string;
  summary: string;
  checklist: string[];
  rawText?: string;
  metadata?: {
    textLength: number;
    summaryLength: number;
    checklistCount: number;
  };
}

// New types for saved analysis and history
export interface SavedAnalysis {
  id: string;
  title: string;
  documentTitle: string;
  documentUrl?: string;
  documentFile?: string; // filename
  analysisResult: AnalysisResult;
  createdAt: string;
  updatedAt: string;
  shareId?: string; // for public sharing
}

export interface AnalysisHistory {
  analyses: SavedAnalysis[];
  totalCount: number;
}

export interface ShareableAnalysis {
  id: string;
  title: string;
  documentTitle: string;
  analysisResult: AnalysisResult;
  createdAt: string;
  isPublic: boolean;
}

export interface QAResult {
  question: string;
  answer: string;
  translated?: boolean;
  targetLanguage?: string;
}

export interface SummaryResult {
  summary: string;
  originalLength: number;
  translated?: boolean;
  targetLanguage?: string;
}

export interface ChecklistResult {
  checklist: string[];
  count: number;
  translated?: boolean;
  targetLanguage?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// API service class
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log('🌐 Making request to:', url);
      console.log('📤 Request body:', options.body);
      
      const response = await fetch(url, { ...defaultOptions, ...options });
      console.log('📥 Response status:', response.status);
      
      const data = await response.json();

      if (!response.ok) {
        // Check if the backend returned a detailed error message
        if (data.message) {
          throw new Error(data.message);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Extract text from URL
  async extractTextFromUrl(url: string): Promise<{ text: string; title: string; url: string }> {
    const response = await this.request<{ text: string; title: string; url: string }>('/extract-text', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    return response.data;
  }

  // Generate summary from text
  async generateSummary(text: string, targetLang: string = 'en'): Promise<SummaryResult> {
    const response = await this.request<SummaryResult>('/summarize', {
      method: 'POST',
      body: JSON.stringify({ text, targetLang }),
    });
    return response.data;
  }

  // Generate checklist from text
  async generateChecklist(text: string, targetLang: string = 'en'): Promise<ChecklistResult> {
    const response = await this.request<ChecklistResult>('/checklist', {
      method: 'POST',
      body: JSON.stringify({ text, targetLang }),
    });
    return response.data;
  }

  // Analyze URL (complete analysis)
  async analyzeUrl(url: string): Promise<AnalysisResult> {
    const response = await this.request<AnalysisResult>('/analyze-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    return response.data;
  }

  // Ask question about policy
  async askQuestion(policyText: string, question: string, targetLang: string = 'en'): Promise<QAResult> {
    console.log('🔍 API Service - askQuestion called with:', {
      policyTextLength: policyText.length,
      question,
      questionLength: question.length,
      targetLang,
      url: `${API_BASE_URL}/ask-question`
    });
    
    const requestBody = { policyText, question, targetLang };
    console.log('📤 Request body being sent:', requestBody);
    console.log('📤 Request body stringified:', JSON.stringify(requestBody));
    
    const response = await this.request<QAResult>('/ask-question', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    return response.data;
  }

  // Process document with advanced analysis
  async processDocument(text: string): Promise<{ chunks: string[]; analysis: string }> {
    const response = await this.request<{ chunks: string[]; analysis: string }>('/process-document', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.request<{ status: string; timestamp: string }>('/health');
    return response.data;
  }

  // Upload file
  async uploadFile(file: File): Promise<{ text: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}/upload-file`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data.data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 