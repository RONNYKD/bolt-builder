import React from 'react';
import { AIAssistant } from '../components/ai/AIAssistant';

export const NoCodeBuilderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Bolt App Builder</h1>
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Templates</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Learn</a>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up Free
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Build Your App <span className="text-blue-600">Without Code</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Turn your ideas into working apps in minutes, not months.
            No coding experience required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Building Now
            </button>
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Watch Tutorial
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-4">Getting Started</h3>
              <ul className="space-y-2">
                <li className="p-2 bg-blue-50 text-blue-600 rounded font-medium">1. Describe your app</li>
                <li className="p-2 text-gray-600 hover:bg-gray-50 rounded">2. Customize design</li>
                <li className="p-2 text-gray-600 hover:bg-gray-50 rounded">3. Add functionality</li>
                <li className="p-2 text-gray-600 hover:bg-gray-50 rounded">4. Preview & test</li>
                <li className="p-2 text-gray-600 hover:bg-gray-50 rounded">5. Publish your app</li>
              </ul>
            </div>
          </div>
          
          {/* Main Builder Area */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-xl font-bold">AI App Builder</h2>
                <p className="text-gray-600">Let AI build your app in 3 simple steps</p>
              </div>
              <div className="p-6">
                <AIAssistant />
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Auto-Install Dependencies</h3>
                <p className="text-gray-600">
                  Our AI automatically handles npm packages and dependencies so you don't have to worry about setup.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                <p className="text-gray-600">
                  See changes instantly with our real-time preview that shows exactly how your app will look.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Bolt App Builder</h3>
              <p className="text-gray-600">
                Build beautiful apps without writing a single line of code.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Forum</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Discord</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2025 Bolt App Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 