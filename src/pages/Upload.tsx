
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload as UploadIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
                  asChild 
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                  disabled={!url.trim() && !file}
                >
                  <Link to="/analyze">
                    Analyze
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full h-12 text-base"
                >
                  <Link to="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
