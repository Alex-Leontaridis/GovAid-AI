import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/ui/navbar-1";
import { HeroSection } from "@/components/hero-section";
import { Logos3 } from "@/components/logos3";
import { Feature } from "@/components/ui/feature";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar1 />

      {/* Hero Section */}
      <HeroSection
        badge={{
          text: "New AI-powered tool",
          action: {
            text: "Learn more",
            href: "#how-it-works"
          }
        }}
        title={<>Understand Government Aid.<br />Instantly With AI</>}
        description="GovAid AI uses powerful AI to simplify complex government policies into plain English. Get summaries, checklists, and answers — without the bureaucracy."
        actions={[
          {
            text: "Get Started",
            href: "/upload",
            variant: "default"
          },
          {
            text: "GitHub",
            href: "https://github.com/Alex-Leontaridis/GovAid-AI",
            variant: "outline",
            icon: "github"
          }
        ]}
      />

      {/* Government Platforms Logos */}
      <Logos3 />

      {/* Feature Showcase Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Analyzing Policies from America's Most Trusted Agencies
            </h2>
          </div>
        </div>
        <Feature
          title="Document Upload & Processing"
          badge="Step 1"
          description="Easily upload or paste government policy documents for instant analysis."
          features={[
            {
              title: "Multi-format Support",
              description: "Upload PDF, DOCX, or DOC files, or paste a policy URL."
            },
            {
              title: "URL Validation",
              description: "Smart validation and normalization of policy URLs."
            },
            {
              title: "Progress Tracking",
              description: "Get real-time feedback during document processing."
            }
          ]}
        />
        <Feature
          title="AI-Powered Policy Analysis"
          badge="Step 2"
          description="Let AI break down complex policies into plain English summaries and actionable checklists."
          features={[
            {
              title: "Summary Generation",
              description: "Get concise, plain-language summaries of policy documents."
            },
            {
              title: "Requirement Extraction",
              description: "Automatically extract and list eligibility criteria."
            },
            {
              title: "Document Statistics",
              description: "See document length, summary size, and requirements count."
            }
          ]}
        />
        <Feature
          title="Interactive Q&A System"
          badge="Step 3"
          description="Ask questions and get instant, context-aware answers about any policy."
          features={[
            {
              title: "Context-Aware Responses",
              description: "AI answers based on the specific uploaded policy."
            },
            {
              title: "Example Questions",
              description: "Get suggestions for common policy-related questions."
            },
            {
              title: "Response Formatting",
              description: "Beautifully formatted answers with markdown support."
            }
          ]}
        />
      </div>

      {/* Why GovAid AI */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why GovAid AI?
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                "Cuts through government jargon",
                "Saves time and confusion", 
                "Built with OpenRouter + OpenAI API"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
              <Link to="/upload">
                Analyze Your First Policy
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
