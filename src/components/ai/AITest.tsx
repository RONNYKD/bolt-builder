import React, { useState } from 'react';
import { testAIResponse } from '../../lib/gemini';
import { Button } from '../ui/Button';

export const AITest: React.FC = () => {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    try {
      const result = await testAIResponse();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      });
    }
    setIsTesting(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">AI Functionality Test</h2>
      
      <Button
        onClick={runTest}
        isLoading={isTesting}
        className="mb-4"
      >
        Run AI Test
      </Button>

      {testResult && (
        <div className={`p-4 rounded-md ${
          testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <p className="font-medium">
            {testResult.success ? '✅ Test Successful' : '❌ Test Failed'}
          </p>
          <p className="mt-2">{testResult.message}</p>
        </div>
      )}
    </div>
  );
}; 