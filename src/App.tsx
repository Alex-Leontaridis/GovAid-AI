import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "@/components/ui-custom/footer";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Analyze from "./pages/Analyze";
import QA from "./pages/QA";
import History from "./pages/History";
import View from "./pages/View";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AnalysisProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/qa" element={<QA />} />
                <Route path="/history" element={<History />} />
                <Route path="/view/:shareId" element={<View />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AnalysisProvider>
  </QueryClientProvider>
);

export default App;
