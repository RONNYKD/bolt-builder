import React, { useState } from 'react';
import { SandboxEditor } from '../SandboxEditor';

export const AIAssistant: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [codeOutput, setCodeOutput] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const suggestions = [
    'Create a simple landing page',
    'Build a contact form',
    'Make a product gallery',
    'Design a user profile page'
  ];

  const handleGenerateCode = async () => {
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI code generation (replace with actual AI implementation)
    setTimeout(() => {
      const sampleCode = `// Generated from: ${userPrompt}
import React from 'react';

export default function App() {
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">${userPrompt}</h1>
      <p className="text-gray-600">This is your AI-generated component!</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Click me
      </button>
    </div>
  );
}`;
      
      setCodeOutput(sampleCode);
      setActiveStep(2);
      setIsLoading(false);
    }, 1500);
  };

  const handleCommandRun = (command: string) => {
    // In a real implementation, this would execute the command in the sandbox
    console.log(`Running command: ${command}`);
    setActiveStep(3);
  };

  return (
    <div className="flex flex-col space-y-6 p-4 bg-gray-50 rounded-lg">
      {/* Step 1: Describe what you want to build */}
      <div className={`transition-all duration-300 ${activeStep !== 1 ? 'opacity-60' : ''}`}>
        <h2 className="text-lg font-bold mb-2">
          <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center mr-2">1</span>
          Tell me what you want to build
        </h2>
        
        <div className="mb-4">
          <textarea
            className="w-full p-3 border rounded-lg"
            placeholder="Describe your app idea in simple words..."
            rows={3}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            disabled={activeStep !== 1}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition-colors"
              onClick={() => setUserPrompt(suggestion)}
              disabled={activeStep !== 1}
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <button
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          onClick={handleGenerateCode}
          disabled={!userPrompt.trim() || isLoading || activeStep !== 1}
        >
          {isLoading ? 'Creating your app...' : 'Create My App'}
        </button>
      </div>
      
      {/* Step 2: View and edit the generated code */}
      {activeStep >= 2 && (
        <div className={`transition-all duration-300 ${activeStep !== 2 ? 'opacity-60' : ''}`}>
          <h2 className="text-lg font-bold mb-2">
            <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center mr-2">2</span>
            Edit your app (optional)
          </h2>
          
          <div className="mb-4 border rounded-lg overflow-hidden">
            <SandboxEditor code={codeOutput} />
          </div>
          
          <button
            className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => handleCommandRun('npm install && npm start')}
            disabled={activeStep !== 2}
          >
            Run My App
          </button>
        </div>
      )}
      
      {/* Step 3: Deploy and share */}
      {activeStep >= 3 && (
        <div className={`transition-all duration-300 ${activeStep !== 3 ? 'opacity-60' : ''}`}>
          <h2 className="text-lg font-bold mb-2">
            <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center mr-2">3</span>
            Share your app
          </h2>
          
          <div className="p-4 border rounded-lg bg-white">
            <p className="mb-4">Your app is running! Here's how to share it:</p>
            
            <div className="flex items-center mb-2">
              <div className="flex-1 bg-gray-100 p-2 rounded mr-2 font-mono text-sm">https://yourapp.bolt.app</div>
              <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                Download Code
              </button>
              <button className="flex-1 p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                Publish App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 