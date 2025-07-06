
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-gray-200">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="h-10 w-10 text-primary" />
              </div>
              
              <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Go Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
