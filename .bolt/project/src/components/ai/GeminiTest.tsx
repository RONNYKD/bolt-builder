import React, { useState } from 'react';

export const GeminiTest: React.FC = () => {
  const [previewCode] = useState<string>('');
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Placeholder for future app features
  // You can add your main app UI here

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden h-[500px]">
            {previewCode ? (
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body class="p-4">
                      ${previewCode}
                    </body>
                  </html>
                `}
                title="Component Preview"
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {isLoading ? 'Generating component...' : 'No component generated yet'}
              </div>
            )}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mt-4">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 