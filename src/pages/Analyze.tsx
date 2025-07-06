import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageSquare, ArrowLeft, FileText, Loader2, Download, Share2, History } from "lucide-react";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { Navbar1 } from "@/components/ui/navbar-1";
import { AnalysisStorage } from "@/lib/storageUtils";
import { PDFGenerator } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

const Analyze = () => {
  const { state, dispatch } = useAnalysis();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // If no analysis result, redirect to upload
  if (!state.analysisResult) {
    navigate('/upload');
    return null;
  }

  const { analysisResult, documentTitle, documentUrl, documentFile, isAnalyzing } = state;

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const blob = await PDFGenerator.generateAnalysisPDF(analysisResult, {
        title: 'Policy Analysis Report',
        documentTitle: documentTitle || 'Document Analysis',
        includeRawText: false,
      });
      
      const filename = `${(documentTitle || 'analysis').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.pdf`;
      PDFGenerator.downloadPDF(blob, filename);
      
      toast({
        title: "PDF downloaded!",
        description: "Your analysis has been saved as a PDF file.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareAnalysis = async () => {
    try {
      // First save the analysis if not already saved
      let savedAnalysis = AnalysisStorage.getAllAnalyses().find(
        a => a.documentTitle === documentTitle && 
             a.analysisResult.summary === analysisResult.summary
      );
      
      if (!savedAnalysis) {
        savedAnalysis = AnalysisStorage.saveAnalysis(
          analysisResult,
          documentTitle || 'Untitled Analysis',
          documentUrl,
          documentFile?.name
        );
        dispatch({ type: 'ADD_SAVED_ANALYSIS', payload: savedAnalysis });
      }
      
      // Create shareable link
      const shareId = AnalysisStorage.createShareableLink(savedAnalysis.id);
      if (shareId) {
        const shareUrl = `${window.location.origin}/view/${shareId}`;
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Shareable link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error creating shareable link:', error);
      toast({
        title: "Error",
        description: "Failed to create shareable link. Please try again.",
        variant: "destructive",
      });
    }
  };

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

              {/* Action Buttons */}
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export to PDF
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleShareAnalysis}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Analysis
                    </Button>
                    
                    <Button 
                      asChild
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Link to="/history">
                        <History className="h-4 w-4 mr-2" />
                        View History
                      </Link>
                    </Button>
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
