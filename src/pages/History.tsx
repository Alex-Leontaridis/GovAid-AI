import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  Trash2, 
  Share2, 
  Download, 
  Eye,
  Calendar,
  ExternalLink,
  Upload
} from 'lucide-react';
import { Navbar1 } from '@/components/ui/navbar-1';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { AnalysisStorage } from '@/lib/storageUtils';
import { SavedAnalysis } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const History = () => {
  const { state, dispatch } = useAnalysis();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedAnalyses();
  }, []);

  const loadSavedAnalyses = () => {
    try {
      const analyses = AnalysisStorage.getAllAnalyses();
      dispatch({ type: 'SET_SAVED_ANALYSES', payload: analyses });
    } catch (error) {
      console.error('Error loading saved analyses:', error);
      toast({
        title: "Error",
        description: "Failed to load saved analyses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnalysis = (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      try {
        AnalysisStorage.deleteAnalysis(id);
        dispatch({ type: 'REMOVE_SAVED_ANALYSIS', payload: id });
        toast({
          title: "Success",
          description: "Analysis deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting analysis:', error);
        toast({
          title: "Error",
          description: "Failed to delete analysis",
          variant: "destructive",
        });
      }
    }
  };

  const handleShareAnalysis = (analysis: SavedAnalysis) => {
    try {
      const shareId = AnalysisStorage.createShareableLink(analysis.id);
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
        description: "Failed to create shareable link",
        variant: "destructive",
      });
    }
  };

  const handleViewAnalysis = (analysis: SavedAnalysis) => {
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: analysis.analysisResult });
    dispatch({ type: 'SET_DOCUMENT_TITLE', payload: analysis.documentTitle });
    dispatch({ type: 'SET_DOCUMENT_URL', payload: analysis.documentUrl || '' });
    navigate('/analyze');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceIcon = (analysis: SavedAnalysis) => {
    if (analysis.documentUrl) {
      return <ExternalLink className="h-4 w-4" />;
    }
    if (analysis.documentFile) {
      return <Upload className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getSourceText = (analysis: SavedAnalysis) => {
    if (analysis.documentUrl) {
      return 'URL';
    }
    if (analysis.documentFile) {
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your analysis history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Analysis History
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your saved policy analyses and reports
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/upload" className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  New Analysis
                </Link>
              </Button>
              
              {state.savedAnalyses.length > 0 && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all saved analyses? This action cannot be undone.')) {
                      AnalysisStorage.clearAllData();
                      dispatch({ type: 'SET_SAVED_ANALYSES', payload: [] });
                      toast({
                        title: "Success",
                        description: "All analyses cleared",
                      });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          {state.savedAnalyses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                      <p className="text-2xl font-bold text-gray-900">{state.savedAnalyses.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Shared Links</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {state.savedAnalyses.filter(a => a.shareId).length}
                      </p>
                    </div>
                    <Share2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Storage Used</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(AnalysisStorage.getStorageStats().storageUsed / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analyses List */}
          {state.savedAnalyses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved analyses yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by analyzing a policy document to see your history here.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/upload" className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Start Your First Analysis
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {state.savedAnalyses.map((analysis) => (
                <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {analysis.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                {getSourceIcon(analysis)}
                                <span>{getSourceText(analysis)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(analysis.createdAt)}</span>
                              </div>
                              {analysis.shareId && (
                                <Badge variant="secondary" className="text-xs">
                                  Shared
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Requirements:</span>
                            <span className="text-gray-600 ml-1">
                              {analysis.analysisResult.checklist.length} items
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Summary:</span>
                            <span className="text-gray-600 ml-1">
                              {analysis.analysisResult.summary.length} characters
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Document:</span>
                            <span className="text-gray-600 ml-1">
                              {analysis.analysisResult.metadata?.textLength.toLocaleString() || 'N/A'} chars
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewAnalysis(analysis)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareAnalysis(analysis)}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAnalysis(analysis.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History; 