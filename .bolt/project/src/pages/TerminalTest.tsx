import React from 'react';
import { SimpleTerminal } from '../components/SimpleTerminal';
import { useTerminalStore } from '../stores/terminalStore';
import { Terminal, RefreshCw, Trash2 } from 'lucide-react';

export const TerminalTest: React.FC = () => {
  const { isConnected, clearOutput } = useTerminalStore();

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Terminal Test</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-gray-200 rounded-lg"
              title="Reconnect"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={clearOutput}
              className="p-2 hover:bg-gray-200 rounded-lg"
              title="Clear Terminal"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-96">
          <SimpleTerminal wsUrl="ws://localhost:3001" />
        </div>
      </div>
    </div>
  );
}; 