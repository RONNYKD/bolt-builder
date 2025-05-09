import React, { useState } from 'react';
import { SandboxEditor } from './SandboxEditor';
import { generateComponentCode } from '../lib/ai-service';
import { toast } from 'react-hot-toast';

interface AISandboxProps {
  initialCode?: string;
}

export const AISandbox: React.FC<AISandboxProps> = ({ initialCode = '' }) => {
  const [code, setCode] = useState(initialCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleAIGenerate = async (userPrompt: string) => {
    setIsProcessing(true);
    try {
      const result = await generateComponentCode(userPrompt);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setCode(result.code);
      toast.success('Code generated successfully!');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate code');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ai-sandbox">
      <div className="ai-controls mb-4 p-4 bg-gray-100 rounded-lg">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the component you want to create..."
          className="w-full p-2 border rounded mb-2"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && prompt.trim()) {
              handleAIGenerate(prompt.trim());
            }
          }}
        />
        <div className="flex justify-between items-center">
          <button
            onClick={() => prompt.trim() && handleAIGenerate(prompt.trim())}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isProcessing || !prompt.trim()}
          >
            {isProcessing ? 'Generating...' : 'Generate Component'}
          </button>
          
          <button
            onClick={() => {
              setPrompt('');
              setCode('');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Reset
          </button>
        </div>
      </div>
      
      <SandboxEditor code={code} />
    </div>
  );
}; 