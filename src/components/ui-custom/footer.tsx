
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/logo.png" 
              alt="GovAid AI" 
              className="h-6 w-auto"
            />
          </div>
          <p className="text-gray-400">
            © 2025 GovAid AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
