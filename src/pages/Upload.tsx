import { useState, useEffect } from "react";
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
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/page-transition";

import { motion } from "motion/react";
import { PolicyBadges } from "@/components/ui/policy-badges";

// Progress indicator component
const ProgressIndicator = ({ currentStep, isProcessing }: { currentStep: number; isProcessing: boolean }) => {
  const steps = [
    { number: 1, text: "Validating input" },
    { number: 2, text: "Extracting document content" },
    { number: 3, text: "Processing text with AI" },
    { number: 4, text: "Generating summary" },
    { number: 5, text: "Creating checklist" }
  ];

  if (!isProcessing) return null;

  return (
    <motion.div 
      className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-blue-900">
            Step {currentStep}/5
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <motion.div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-blue-300'
                }`}
                animate={step === currentStep ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      </div>
      <p className="text-sm text-blue-700">
        {steps[currentStep - 1]?.text || "Processing..."}
      </p>
    </motion.div>
  );
};

const Upload = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { dispatch } = useAnalysis();

  useEffect(() => {
    if (autoAnalyze && url) {
      handleAnalyze();
      setAutoAnalyze(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze, url]);

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

  const handlePolicySelect = (policyUrl: string) => {
    setUrl(policyUrl);
    setFile(null); // Clear any selected file
    toast({
      title: "Policy selected",
      description: "The policy URL has been added to the input field.",
    });
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
    setCurrentStep(1); // Start at step 1
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      let documentText = '';
      let documentTitle = '';

      if (normalizedUrl) {
        // Process URL
        console.log('Processing URL:', normalizedUrl);
        dispatch({ type: 'SET_DOCUMENT_URL', payload: normalizedUrl });
        
        setCurrentStep(2); // Step 2: Extracting document content
        toast({
          title: "Processing URL",
          description: "Extracting content from the provided URL...",
        });

        const urlResult = await apiService.extractTextFromUrl(normalizedUrl);
        documentText = urlResult.text;
        documentTitle = urlResult.title;
        
        // Add small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 400));
        
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
        
        setCurrentStep(2); // Step 2: Extracting document content
        toast({
          title: "Processing file",
          description: `Extracting text from ${file.name}...`,
        });

        const fileResult = await apiService.uploadFile(file);
        documentText = fileResult.text;
        documentTitle = file.name;
        
        // Add small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 400));
        
        console.log('Setting document text from file:', {
          textLength: documentText.length,
          title: documentTitle,
          textPreview: documentText.substring(0, 100) + '...'
        });
        dispatch({ type: 'SET_DOCUMENT_TEXT', payload: documentText });
        dispatch({ type: 'SET_DOCUMENT_TITLE', payload: documentTitle });
      }

      // Generate analysis
      setCurrentStep(3); // Step 3: Processing text with AI
      toast({
        title: "Analyzing document",
        description: "Processing text with AI...",
      });

      dispatch({ type: 'SET_ANALYZING', payload: true });

      // Add small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStep(4); // Step 4: Generating summary
      const summaryResult = await apiService.generateSummary(documentText);
      
      // Add small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep(5); // Step 5: Creating checklist
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
      setCurrentStep(1); // Reset progress
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Navbar1 />
        <div className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Analyze a Government Aid Policy
                </h1>
                <p className="text-xl text-gray-600">
                  Paste a government aid policy URL or upload a PDF/DOCX
                </p>
              </motion.div>

              {/* Upload Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <CardTitle className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        Document Input
                      </CardTitle>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <StaggerContainer>
                      {/* URL Input */}
                      <StaggerItem>
                        <div className="space-y-3">
                          <Label htmlFor="url" className="text-base font-medium">
                            Government Aid Policy URL
                          </Label>
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileFocus={{ scale: 1.02 }}
                          >
                            <Input
                              id="url"
                              type="url"
                              placeholder="https://example.gov/policy-document"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              className="h-12 text-base"
                            />
                          </motion.div>

                          <p className="text-xs text-gray-400">
                            Here are some examples you can use (Policies are randomly selected each time. Refresh to see different examples.)
                          </p>
                          <PolicyBadges onSelect={(policyUrl) => {
                            setUrl(policyUrl);
                            setFile(null);
                            setAutoAnalyze(true);
                          }} />
                        </div>
                      </StaggerItem>

                      {/* Divider */}
                      <StaggerItem>
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500">OR</span>
                          </div>
                        </motion.div>
                      </StaggerItem>

                      {/* File Upload */}
                      <StaggerItem>
                        <div className="space-y-3">
                          <Label htmlFor="file" className="text-base font-medium">
                            Upload Document
                          </Label>
                          
                          <motion.div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors"
                            whileHover={{ 
                              scale: 1.02,
                              borderColor: "hsl(var(--primary))",
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              animate={{ 
                                y: [0, -5, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            </motion.div>
                            
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
                                Government aid policy documents: PDF, DOC, DOCX (max 25MB)
                              </p>
                            </Label>
                          </motion.div>

                          {file && (
                            <motion.div 
                              className="bg-green-50 border border-green-200 rounded-lg p-4"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, type: "spring" }}
                            >
                              <p className="text-sm text-green-800">
                                Selected: {file.name}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </StaggerItem>

                      {/* Action Buttons */}
                      <StaggerItem>
                        <div className="space-y-4 pt-4">
                          <ProgressIndicator currentStep={currentStep} isProcessing={isProcessing} />
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
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
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              variant="outline" 
                              onClick={() => navigate('/')}
                              className="w-full h-12 text-base"
                              disabled={isProcessing}
                            >
                              Back to Home
                            </Button>
                          </motion.div>
                        </div>
                      </StaggerItem>
                    </StaggerContainer>
                  </CardContent>
                </Card>
              </motion.div>


            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Upload;
