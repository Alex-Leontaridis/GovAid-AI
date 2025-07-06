import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AnalysisResult, QAResult } from '@/lib/api';

// Types for the analysis state
interface AnalysisState {
  // Document data
  documentText: string;
  documentUrl: string;
  documentFile: File | null;
  documentTitle: string;
  
  // Analysis results
  analysisResult: AnalysisResult | null;
  
  // QA conversation
  qaHistory: QAResult[];
  
  // Loading states
  isLoading: boolean;
  isAnalyzing: boolean;
  isAskingQuestion: boolean;
  
  // Error state
  error: string | null;
}

// Action types
type AnalysisAction =
  | { type: 'SET_DOCUMENT_TEXT'; payload: string }
  | { type: 'SET_DOCUMENT_URL'; payload: string }
  | { type: 'SET_DOCUMENT_FILE'; payload: File | null }
  | { type: 'SET_DOCUMENT_TITLE'; payload: string }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalysisResult }
  | { type: 'ADD_QA_ENTRY'; payload: QAResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_ASKING_QUESTION'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AnalysisState = {
  documentText: '',
  documentUrl: '',
  documentFile: null,
  documentTitle: '',
  analysisResult: null,
  qaHistory: [],
  isLoading: false,
  isAnalyzing: false,
  isAskingQuestion: false,
  error: null,
};

// Reducer function
function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'SET_DOCUMENT_TEXT':
      return { ...state, documentText: action.payload };
    case 'SET_DOCUMENT_URL':
      return { ...state, documentUrl: action.payload };
    case 'SET_DOCUMENT_FILE':
      return { ...state, documentFile: action.payload };
    case 'SET_DOCUMENT_TITLE':
      return { ...state, documentTitle: action.payload };
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload };
    case 'ADD_QA_ENTRY':
      return { 
        ...state, 
        qaHistory: [...state.qaHistory, action.payload] 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_ASKING_QUESTION':
      return { ...state, isAskingQuestion: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Context
interface AnalysisContextType {
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

// Provider component
interface AnalysisProviderProps {
  children: ReactNode;
}

export function AnalysisProvider({ children }: AnalysisProviderProps) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
}

// Hook to use the analysis context
export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
} 