
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, ArrowLeft, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QA = () => {
  const [question, setQuestion] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question to ask the AI.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Question submitted",
      description: "AI is processing your question...",
    });

    setQuestion("");
  };

  const sampleQA = [
    {
      question: "Who qualifies for this policy?",
      answer: "Anyone earning below 80% of the area median income qualifies for this housing assistance program. Priority is given to families with children, elderly individuals (62+), and persons with disabilities. You must also be a U.S. citizen or eligible non-citizen with proper documentation."
    },
    {
      question: "How much will I pay for rent?",
      answer: "As a program participant, you'll typically pay 30% of your adjusted monthly income toward housing costs. For example, if your monthly income is $2,000, you'd pay approximately $600, and the program would cover the remaining rent up to the local payment standard."
    },
    {
      question: "How long is the waiting list?",
      answer: "Wait times vary significantly by location, ranging from 6 months to 8+ years. Most housing authorities maintain waiting lists due to high demand. Emergency cases or those with priority status may be processed more quickly."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" />
              Ask the AI
            </h1>
            <p className="text-xl text-gray-600">
              Get instant answers about the policy
            </p>
          </div>

          {/* Question Input */}
          <Card className="mb-8 border-gray-200">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask me anything about this policy..."
                  className="h-12 text-base"
                />
                <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 px-6">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <div className="space-y-6">
            {sampleQA.map((qa, index) => (
              <div key={index} className="space-y-4">
                {/* User Question */}
                <div className="flex gap-4 justify-end">
                  <div className="max-w-2xl">
                    <Card className="bg-primary text-white border-primary">
                      <CardContent className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">You</span>
                        </div>
                        <p>{qa.question}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* AI Answer */}
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-2xl">
                    <Card className="border-gray-200">
                      <CardContent className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-primary">GovAid AI</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Button variant="outline" asChild size="lg" className="px-8 py-3">
              <Link to="/analyze" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QA;
