import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/ui/navbar-1";
import { HeroSection } from "@/components/hero-section";
import { Logos3 } from "@/components/logos3";
import { Feature } from "@/components/ui/feature";
import { ProblemSolutionExample } from "@/components/ui/problem-solution-example";
import { Cta4 } from "@/components/cta-4";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/page-transition";
import { motion } from "motion/react";

const Home = () => {
  return (
    <PageTransition>
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
          title={<>Understand Government Aid Policies.<br />Instantly With AI</>}
          description="We guide users through discovering and applying for government benefits, breaking down complex requirements to ensure no one is left behind."
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

        {/* Problem VS Solution Section */}
        <ProblemSolutionExample />

        {/* Feature Showcase Section */}
        <motion.div 
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Analyzing Government Aid Policies from America's Most Trusted Agencies
              </h2>
            </motion.div>
            
            {/* Steps Grid */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaggerItem>
                <Feature
                  title="Document Upload & Processing"
                  badge="Step 1"
                  description="Easily upload or paste government aid policy documents for instant analysis."
                  features={[
                    {
                      title: "Multi-format Support",
                      description: "Upload PDF, DOCX, or DOC files, or paste a government aid policy URL."
                    },
                    {
                      title: "URL Validation",
                      description: "Smart validation and normalization of government policy URLs."
                    },
                    {
                      title: "Progress Tracking",
                      description: "Get real-time feedback during document processing."
                    }
                  ]}
                />
              </StaggerItem>
              <StaggerItem>
                <Feature
                  title="AI-Powered Aid Policy Analysis"
                  badge="Step 2"
                  description="Let AI break down complex government aid policies into plain English summaries and actionable checklists."
                  features={[
                    {
                      title: "Summary Generation",
                      description: "Get concise, plain-language summaries of government aid policy documents."
                    },
                    {
                      title: "Requirement Extraction",
                      description: "Automatically extract and list eligibility criteria for government assistance."
                    },
                    {
                      title: "Document Statistics",
                      description: "See document length, summary size, and requirements count."
                    }
                  ]}
                />
              </StaggerItem>
              <StaggerItem>
                <Feature
                  title="Interactive Q&A System"
                  badge="Step 3"
                  description="Ask questions and get instant, context-aware answers about any government aid policy."
                  features={[
                    {
                      title: "Context-Aware Responses",
                      description: "AI answers based on the specific uploaded government aid policy."
                    },
                    {
                      title: "Example Questions",
                      description: "Get suggestions for common government aid policy questions."
                    },
                    {
                      title: "Response Formatting",
                      description: "Beautifully formatted answers with markdown support."
                    }
                  ]}
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </motion.div>

        {/* Watch Our Demo */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Watch Our Demo
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See how GovAid AI transforms complex government policies into clear, actionable information in just minutes.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="relative aspect-video rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/zaxJZg9ihHQ"
                  title="GovAid AI Demo"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <Cta4
          title="Ready to transform government policies into clear insights?"
          description="We guide users through discovering and applying for government benefits, breaking down complex requirements to ensure no one is left behind."
          buttonText="Start Analyzing Now"
          buttonUrl="/upload"
          items={[
            "AI-Powered Analysis",
            "Plain English Summaries",
            "Eligibility Checklists",
            "Interactive Q&A",
            "Multi-format Support"
          ]}
        />
      </div>
    </PageTransition>
  );
};

export default Home;
