import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PromptInputProps {
  onPromptSubmit: (prompt: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt);
      navigate('/ai-builder');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Describe Your App</h2>
        <p className="text-gray-600 mb-6">
          Tell us what kind of app you want to build. Be as specific as possible about features, design, and functionality.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: I want to build a task management app with a kanban board, due dates, and team collaboration features..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate App
          </button>
        </form>
      </div>
    </div>
  );
}; 