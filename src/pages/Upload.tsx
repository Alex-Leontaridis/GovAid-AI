
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { apiService } from "@/lib/api";
import { AnalysisStorage } from "@/lib/storageUtils";
import { Navbar1 } from "@/components/ui/navbar-1";

const Upload = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { dispatch } = useAnalysis();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        toast({
          title: "File selected",
          description: `${selectedFile.name} is ready for analysis.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim() && !file) {
      toast({
        title: "No input provided",
        description: "Please provide a URL or upload a file.",
        variant: "destructive",
      });
      return;
    }

    // Validate and normalize URL if provided
    let normalizedUrl = url.trim();
    if (normalizedUrl) {
      try {
        // Add protocol if missing
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
          normalizedUrl = 'https://' + normalizedUrl;
        }
        
        // Validate the URL
        new URL(normalizedUrl);
        
        // Update the URL state with the normalized version
        setUrl(normalizedUrl);
      } catch {
        toast({
          title: "Invalid URL",
          description: "Please provide a valid URL starting with http:// or https://",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      let documentText = '';
      let documentTitle = '';

      if (normalizedUrl) {
        // Process URL
        console.log('Processing URL:', normalizedUrl);
        dispatch({ type: 'SET_DOCUMENT_URL', payload: normalizedUrl });
        
        toast({
          title: "Processing URL",
          description: "Extracting content from the provided URL...",
        });

        const urlResult = await apiService.extractTextFromUrl(normalizedUrl);
        documentText = urlResult.text;
        documentTitle = urlResult.title;
        
        console.log('Setting document text from URL:', {
          textLength: documentText.length,
          title: documentTitle,
          textPreview: documentText.substring(0, 100) + '...'
        });
        dispatch({ type: 'SET_DOCUMENT_TEXT', payload: documentText });
        dispatch({ type: 'SET_DOCUMENT_TITLE', payload: documentTitle });
      } else if (file) {
        // Process file
        dispatch({ type: 'SET_DOCUMENT_FILE', payload: file });
        
        toast({
          title: "Processing file",
          description: `Extracting text from ${file.name}...`,
        });

        const fileResult = await apiService.uploadFile(file);
        documentText = fileResult.text;
        documentTitle = file.name;
        
        console.log('Setting document text from file:', {
          textLength: documentText.length,
          title: documentTitle,
          textPreview: documentText.substring(0, 100) + '...'
        });
        dispatch({ type: 'SET_DOCUMENT_TEXT', payload: documentText });
        dispatch({ type: 'SET_DOCUMENT_TITLE', payload: documentTitle });
      }

      // Generate analysis
      toast({
        title: "Analyzing document",
        description: "Generating summary and checklist...",
      });

      dispatch({ type: 'SET_ANALYZING', payload: true });

      const summaryResult = await apiService.generateSummary(documentText);
      const checklistResult = await apiService.generateChecklist(documentText);

      const analysisResult = {
        summary: summaryResult.summary,
        checklist: checklistResult.checklist,
        rawText: documentText,
        metadata: {
          textLength: documentText.length,
          summaryLength: summaryResult.summary.length,
          checklistCount: checklistResult.checklist.length,
        },
      };

      dispatch({ type: 'SET_ANALYSIS_RESULT', payload: analysisResult });
      dispatch({ type: 'SET_ANALYZING', payload: false });
      dispatch({ type: 'SET_LOADING', payload: false });

      // Auto-save the analysis
      try {
        const savedAnalysis = AnalysisStorage.saveAnalysis(
          analysisResult,
          documentTitle || 'Untitled Analysis',
          url || undefined,
          file?.name
        );
        dispatch({ type: 'ADD_SAVED_ANALYSIS', payload: savedAnalysis });
      } catch (error) {
        console.error('Error auto-saving analysis:', error);
        // Don't show error toast for auto-save failures
      }

      toast({
        title: "Analysis complete",
        description: "Your document has been analyzed and saved successfully!",
      });

      navigate('/analyze');
    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Create a user-friendly error message
      let errorMessage = 'Analysis failed. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('HTTP 404')) {
          errorMessage = 'The URL you provided could not be found. Please check the URL and try again.';
        } else if (error.message.includes('Invalid URL') || error.message.includes('valid URL')) {
          errorMessage = 'Please provide a valid URL starting with http:// or https://';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'The website took too long to respond. Please try again or use a different URL.';
        } else if (error.message.includes('ENOTFOUND')) {
          errorMessage = 'Could not reach the website. Please check your internet connection and try again.';
        } else if (error.message.includes('Validation failed')) {
          errorMessage = 'Please provide a valid URL starting with http:// or https://';
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ANALYZING', payload: false });
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar1 />
      <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Analyze a Government Policy
            </h1>
            <p className="text-xl text-gray-600">
              Paste a URL or upload a PDF/DOCX
            </p>
          </div>

          {/* Upload Card */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Document Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* URL Input */}
              <div className="space-y-3">
                <Label htmlFor="url" className="text-base font-medium">
                  Policy URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.gov/policy-document"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500">
                  Enter a government policy URL (e.g., https://www.gov.uk/benefits, https://www.irs.gov/credits)
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">OR</span>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label htmlFor="file" className="text-base font-medium">
                  Upload Document
                </Label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <Label htmlFor="file" className="cursor-pointer">
                    <p className="text-base font-medium text-gray-700 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX (max 25MB)
                    </p>
                  </Label>
                </div>

                {file && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      Selected: {file.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <Button 
                  onClick={handleAnalyze}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                  disabled={(!url.trim() && !file) || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full h-12 text-base"
                  disabled={isProcessing}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Upload;
