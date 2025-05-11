import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Toaster } from 'react-hot-toast';
import { generatePlan, executeCommand } from '../lib/gemini';
import { StartNewSection } from '../components/StartNewSection';
// import { SandboxEditor } from '../components/SandboxEditor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIBuilderPage: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sandboxFiles, setSandboxFiles] = useState<Record<string, string>>({
    "/App.js": `export default function App() {\n  return <h1>Hello from Sandpack!</h1>;\n}`
  });

  useEffect(() => {
    const prompt = location.state?.prompt;
    if (prompt) {
      setMessages([{ role: 'user', content: prompt }]);
      handleGenerate(prompt);
    }
  }, [location.state]);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Generate plan in simple language
      const plan = await generatePlan(prompt);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: plan }
      ]);

      // Simulate AI multi-file code generation (replace with actual AI integration)
      const generatedFiles: Record<string, string> = {
        "/App.js": `// Generated from: ${prompt}
import React from 'react';

export default function App() {
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">${prompt}</h1>
      <p className="text-gray-600">This is your AI-generated component!</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Click me</button>
    </div>
  );
}`,
        "/components/Header.js": `export function Header() {
  return <header className="bg-blue-600 text-white p-4">AI Builder Header</header>;
}`
      };
      setSandboxFiles(generatedFiles);

      // Execute necessary commands in the sandbox (kept for future real integration)
      const commands = [
        'npm install react react-dom',
        'npm install @types/react @types/react-dom typescript',
        'npm install tailwindcss postcss autoprefixer'
      ];

      for (const command of commands) {
        const result = await executeCommand(command);
        if (result.success) {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: `✅ ${command} completed successfully` }
          ]);
        } else {
          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: `❌ Could not run: ${command}\n- This sandbox does not support running install commands automatically.\n- Please open your project in your own computer or a full-featured cloud IDE.\n- Then run this command in your terminal:\n  \n  ${command}\n\n- If you need help, let me know!` }
          ]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Oops! Something went wrong. Let me try again.' }
      ]);
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    await handleGenerate(input);
  };

  return (
    <>
      <Toaster />
      <PanelGroup direction="horizontal" className="h-screen w-full">
        {/* Chat Interface */}
        <Panel minSize={15} maxSize={50} defaultSize={25} className="border-r border-gray-200 flex flex-col bg-gray-50">
          <StartNewSection />
          <div className="flex-1 overflow-y-auto mb-2 p-4">
            {messages.length === 0 && !isGenerating && (
              <div className="text-gray-400 text-center mt-20">Tell me what kind of app you want to build!</div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 max-w-[90%] ${message.role === 'user' ? 'ml-auto flex justify-end' : 'flex justify-start'}`}
              >
                <div className={`rounded-2xl px-4 py-3 shadow ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'}`}
                  style={{ borderTopLeftRadius: message.role === 'user' ? 16 : 4, borderTopRightRadius: message.role === 'user' ? 4 : 16 }}>
                  {message.content}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start mb-4">
                <div className="rounded-2xl px-4 py-3 shadow bg-white text-gray-800 border animate-pulse">
                  Working on it...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to build?"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </Panel>
        <PanelResizeHandle className="w-2 bg-gray-200 cursor-col-resize" />
        {/* Right Panel: Sandbox */}
        <Panel minSize={50} maxSize={85} defaultSize={75} className="flex flex-col">
          <div className="p-4 flex mb-4 border-b">
            <button
              className="px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none border-blue-600 text-blue-600"
            >
              Live Sandbox
            </button>
          </div>
          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white flex">
            <div className="h-full w-full">
              <div className="p-4 text-sm text-gray-700">Your app is being built here in real-time. You can see the changes as they happen!</div>
              {/* <SandboxEditor files={sandboxFiles} /> */}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </>
  );
}; 