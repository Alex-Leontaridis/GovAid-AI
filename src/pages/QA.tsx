
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, ArrowLeft, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { apiService } from "@/lib/api";
import { Navbar1 } from "@/components/ui/navbar-1";
import ReactMarkdown from "react-markdown";

const QA = () => {
  const [question, setQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state, dispatch } = useAnalysis();

  // Debug: Log the current state
  console.log('QA Component State:', {
    documentText: state.documentText,
    documentTextLength: state.documentText?.length || 0,
    hasDocumentText: !!state.documentText,
    documentTitle: state.documentTitle,
    analysisResult: !!state.analysisResult
  });

  // Check if we have document text to ask questions about
  if (!state.documentText) {
    console.log('No document text found, redirecting to upload');
    navigate('/upload');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question to ask the AI.",
        variant: "destructive",
      });
      return;
    }

    // Check if document text is available and long enough
    if (!state.documentText || state.documentText.trim().length === 0) {
      toast({
        title: "No document found",
        description: "Please analyze a policy document first.",
        variant: "destructive",
      });
      return;
    }

    if (state.documentText.trim().length < 1) {
      toast({
        title: "Document too short",
        description: `Document text is only ${state.documentText.trim().length} characters. Please analyze a longer policy document.`,
        variant: "destructive",
      });
      return;
    }

    if (isAskingQuestion) return;

    setIsAskingQuestion(true);
    dispatch({ type: 'SET_ASKING_QUESTION', payload: true });

    try {
      console.log('Sending question to API:', {
        policyTextLength: state.documentText.length,
        question: question.trim(),
        questionLength: question.trim().length
      });
      console.log('Full policyText:', state.documentText);
      console.log('Full question:', question.trim());

      toast({
        title: "Processing question",
        description: "AI is analyzing your question...",
      });

      const qaResult = await apiService.askQuestion(
        state.documentText,
        question.trim()
      );

      dispatch({ type: 'ADD_QA_ENTRY', payload: qaResult });

      toast({
        title: "Answer ready",
        description: "Your question has been answered!",
      });

      setQuestion("");
    } catch (error) {
      console.error('Question failed:', error);
      toast({
        title: "Question failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAskingQuestion(false);
      dispatch({ type: 'SET_ASKING_QUESTION', payload: false });
    }
  };

  // Use real QA history from context
  const qaHistory = state.qaHistory;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />
      <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" />
              Ask the AI
            </h1>
            <p className="text-xl text-gray-600">
              Get instant answers about the policy
            </p>
          </div>

          {/* Question Input - ChatGPT Style */}
          <Card className="mb-8 border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about this policy... (e.g., 'What are the eligibility requirements?', 'How do I apply?', 'What documents do I need?')"
                  className="h-12 text-base flex-1"
                  disabled={isAskingQuestion}
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 px-6"
                  disabled={isAskingQuestion || !question.trim()}
                >
                  {isAskingQuestion ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                💡 Try asking about eligibility, application process, required documents, or any specific details about the policy.
              </p>
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <div className="space-y-6">
            {qaHistory.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to help you understand this government aid policy!</h3>
                <p className="text-gray-600 mb-6">Ask me anything about the government aid policy document. I can help you understand eligibility requirements, application processes, and more.</p>
                
                {/* Example Questions */}
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Example questions about government aid policies:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-600">
                      "What are the eligibility requirements for this government aid?"
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-600">
                      "How do I apply for this government benefit?"
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-600">
                      "What documents do I need for this government assistance?"
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-600">
                      "What is the application deadline for this government aid?"
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              qaHistory.map((qa, index) => (
                <div key={index} className="space-y-6">
                  {/* User Question */}
                  <div className="flex gap-4 justify-end">
                    <div className="max-w-3xl">
                      <Card className="bg-primary text-white border-primary shadow-sm">
                        <CardContent className="py-4 px-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">You</span>
                          </div>
                          <p className="leading-relaxed">{qa.question}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gray-100">
                        <User className="h-5 w-5 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* AI Answer */}
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-3xl">
                      <Card className="border-gray-200 shadow-sm">
                        <CardContent className="py-4 px-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-primary">GovAid AI</span>
                            <span className="text-xs text-gray-400">• Policy Assistant</span>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-700 leading-relaxed">
                              <ReactMarkdown>{qa.answer}</ReactMarkdown>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Button variant="outline" asChild size="lg" className="px-8 py-3">
              <Link to="/analyze" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Link>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QA;
