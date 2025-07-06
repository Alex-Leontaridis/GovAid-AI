import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/ui/navbar-1";
import { HeroSection } from "@/components/hero-section";
import { Logos3 } from "@/components/logos3";

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

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Upload or Paste",
                description: "Paste a policy URL or upload a PDF/DOCX file"
              },
              {
                icon: CheckCircle,
                title: "Get Summary",
                description: "Get a plain-language summary and checklist"
              },
              {
                icon: MessageSquare,
                title: "Ask Questions",
                description: "Ask the AI questions about the policy"
              }
            ].map((step, index) => (
              <Card key={index} className="text-center border-gray-200">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
