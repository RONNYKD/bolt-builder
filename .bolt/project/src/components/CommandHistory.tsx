import React from 'react';
import { useProjectStore } from '../stores/projectStore';
import { Terminal, MessageSquare, Clock } from 'lucide-react';

export const CommandHistory: React.FC = () => {
  const commandHistory = useProjectStore((state) => state.commandHistory);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getIcon = (type: 'ai' | 'terminal') => {
    return type === 'terminal' ? (
      <Terminal className="w-4 h-4 text-blue-500" />
    ) : (
      <MessageSquare className="w-4 h-4 text-green-500" />
    );
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Recent Commands</h2>
      <div className="space-y-2">
        {commandHistory.length === 0 ? (
          <div className="text-gray-500 text-sm">No commands yet</div>
        ) : (
          commandHistory.map((cmd, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 rounded-lg group"
              onClick={() => {
                // TODO: Implement command re-execution
                console.log('Re-executing command:', cmd.command);
              }}
            >
              {getIcon(cmd.type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{cmd.command}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {formatTime(cmd.timestamp)}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}; 