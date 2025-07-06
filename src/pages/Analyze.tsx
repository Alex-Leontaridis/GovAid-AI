
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageSquare, ArrowLeft, FileText } from "lucide-react";

const Analyze = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      This federal housing assistance program provides rental subsidies and support services 
                      for low-income families, elderly individuals, and persons with disabilities. The program 
                      aims to help participants afford decent, safe, and sanitary housing in the private market.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Participants typically pay 30% of their adjusted monthly income toward housing costs, 
                      with the program covering the remaining portion up to established payment standards. 
                      The program includes both rental assistance and homeownership opportunities.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Additional services may include job training, educational programs, and family 
                      self-sufficiency coordination to help participants achieve economic independence.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility Checklist */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Eligibility Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Household income must be below 80% of area median income",
                      "Must be a U.S. citizen or eligible non-citizen",
                      "Must pass background and credit checks",
                      "Must provide required documentation",
                      "Priority given to families with children, elderly, or disabled members",
                      "Must agree to program rules and lease requirements"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Key Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Program Type:</span>
                      <span className="text-gray-600 ml-2">Housing Choice Voucher</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Income Limit:</span>
                      <span className="text-gray-600 ml-2">80% of AMI</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Rent Contribution:</span>
                      <span className="text-gray-600 ml-2">30% of income</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Wait Time:</span>
                      <span className="text-gray-600 ml-2">Varies by location</span>
                    </div>
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
  );
};

export default Analyze;
