import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-gray-600">We're Hiring!</span>
            <Link to="/help" className="text-gray-600 hover:text-gray-900">
              Help Center
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} BoltCanvas. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}; 