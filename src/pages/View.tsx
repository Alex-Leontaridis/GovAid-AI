import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar,
  ExternalLink,
  Upload,
  Loader2
} from 'lucide-react';
import { Navbar1 } from '@/components/ui/navbar-1';
import { AnalysisStorage } from '@/lib/storageUtils';
import { SavedAnalysis } from '@/lib/api';
import { PDFGenerator } from '@/lib/pdfUtils';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

const View = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (shareId) {
      loadSharedAnalysis(shareId);
    }
  }, [shareId]);

  const loadSharedAnalysis = (id: string) => {
    try {
      const sharedAnalysis = AnalysisStorage.getSharedAnalysis(id);
      if (sharedAnalysis) {
        setAnalysis(sharedAnalysis);
      } else {
        toast({
          title: "Analysis not found",
          description: "This shared analysis may have been deleted or the link is invalid.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading shared analysis:', error);
      toast({
        title: "Error",
        description: "Failed to load the shared analysis",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysis) return;

    setIsGeneratingPDF(true);
    try {
      const blob = await PDFGenerator.generateAnalysisPDF(analysis.analysisResult, {
        title: 'Shared Policy Analysis',
        documentTitle: analysis.documentTitle,
        includeRawText: false,
      });
      
      const filename = `${analysis.documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.pdf`;
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

  const handleShareLink = () => {
    if (shareId) {
      const shareUrl = `${window.location.origin}/view/${shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Shareable link copied to clipboard",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceIcon = () => {
    if (analysis?.documentUrl) {
      return <ExternalLink className="h-4 w-4" />;
    }
    if (analysis?.documentFile) {
      return <Upload className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getSourceText = () => {
    if (analysis?.documentUrl) {
      return 'URL';
    }
    if (analysis?.documentFile) {
      return 'File Upload';
    }
    return 'Text Input';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar1 />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading shared analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar1 />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Found</h1>
            <p className="text-gray-600 mb-6">
              This shared analysis may have been deleted or the link is invalid.
            </p>
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                Shared Analysis
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {analysis.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                {getSourceIcon()}
                <span>{getSourceText()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(analysis.createdAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-primary hover:bg-primary/90"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleShareLink}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed">
                      <ReactMarkdown>{analysis.analysisResult.summary}</ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility Checklist */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-600" />
                    Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.analysisResult.checklist.length > 0 ? (
                      analysis.analysisResult.checklist.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0">
                            ✓
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No specific eligibility requirements found in this document.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Document Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Document Title:</span>
                      <p className="text-gray-600 mt-1">{analysis.documentTitle}</p>
                    </div>
                    
                    {analysis.analysisResult.metadata && (
                      <>
                        <div>
                          <span className="font-medium text-gray-700">Text Length:</span>
                          <span className="text-gray-600 ml-2">
                            {analysis.analysisResult.metadata.textLength.toLocaleString()} characters
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Summary Length:</span>
                          <span className="text-gray-600 ml-2">
                            {analysis.analysisResult.metadata.summaryLength.toLocaleString()} characters
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Requirements Found:</span>
                          <span className="text-gray-600 ml-2">
                            {analysis.analysisResult.metadata.checklistCount} items
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Analysis Date:</span>
                      <span className="text-gray-600 ml-2">
                        {formatDate(analysis.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">About This Analysis</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      This is a shared analysis generated by GovAid-AI. The analysis provides a plain English summary 
                      and eligibility requirements extracted from the original policy document.
                    </p>
                    <p>
                      For interactive features like asking questions about this policy, visit our main platform.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Generated by GovAid-AI - Making government policies accessible to everyone
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Analyze Your Own Document
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View; 