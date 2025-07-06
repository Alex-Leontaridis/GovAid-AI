
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageSquare, ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { Navbar1 } from "@/components/ui/navbar-1";
import ReactMarkdown from "react-markdown";

const Analyze = () => {
  const { state } = useAnalysis();
  const navigate = useNavigate();

  // If no analysis result, redirect to upload
  if (!state.analysisResult) {
    navigate('/upload');
    return null;
  }

  const { analysisResult, documentTitle, isAnalyzing } = state;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />
      <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Policy Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Here's what we found in your document
            </p>
            {documentTitle && (
              <p className="text-lg text-gray-500 mt-2">
                Document: {documentTitle}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Summary
                    {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-600">Generating summary...</span>
                      </div>
                    ) : (
                      <div className="text-gray-700 leading-relaxed">
                        <ReactMarkdown>{analysisResult.summary}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility Checklist */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>
                    Eligibility Checklist
                    {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-600">Generating checklist...</span>
                      </div>
                    ) : analysisResult.checklist.length > 0 ? (
                      analysisResult.checklist.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No eligibility requirements found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Document Info</h3>
                  <div className="space-y-3 text-sm">
                    {analysisResult.metadata && (
                      <>
                        <div>
                          <span className="font-medium text-gray-700">Text Length:</span>
                          <span className="text-gray-600 ml-2">{analysisResult.metadata.textLength.toLocaleString()} characters</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Summary Length:</span>
                          <span className="text-gray-600 ml-2">{analysisResult.metadata.summaryLength.toLocaleString()} characters</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Requirements Found:</span>
                          <span className="text-gray-600 ml-2">{analysisResult.metadata.checklistCount} items</span>
                        </div>
                      </>
                    )}
                    {state.documentUrl && (
                      <div>
                        <span className="font-medium text-gray-700">Source:</span>
                        <span className="text-gray-600 ml-2">URL</span>
                      </div>
                    )}
                    {state.documentFile && (
                      <div>
                        <span className="font-medium text-gray-700">Source:</span>
                        <span className="text-gray-600 ml-2">File Upload</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3">
              <Link to="/qa" className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Ask a Question
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="px-8 py-3">
              <Link to="/upload" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </Link>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Analyze;
