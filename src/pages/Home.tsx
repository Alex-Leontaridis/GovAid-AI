import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { Navbar1 } from "@/components/ui/navbar-1";
import { HeroSection } from "@/components/hero-section";
import { Logos3 } from "@/components/logos3";
import { Feature } from "@/components/ui/feature";
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
          description="GovAid AI uses powerful AI to simplify complex government aid policies into plain English. Get summaries, checklists, and answers about benefits, assistance programs, and eligibility — without the bureaucracy."
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

        {/* Why GovAid AI */}
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
                Why GovAid AI?
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <StaggerContainer className="space-y-6">
                {[
                  "Cuts through government jargon",
                  "Saves time and confusion", 
                  "Built with OpenRouter + OpenAI API"
                ].map((benefit, index) => (
                  <StaggerItem key={index}>
                    <motion.div 
                      className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg"
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: "#f8fafc",
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                      </motion.div>
                      <span className="text-lg text-gray-700">{benefit}</span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16 bg-primary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
                  <Link to="/upload">
                    Analyze Your First Aid Policy
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
};

export default Home;
