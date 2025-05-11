import React, { useEffect, useRef } from 'react';
import { useTerminalStore } from '../stores/terminalStore';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SearchAddon } from '@xterm/addon-search';
import '@xterm/xterm/css/xterm.css';

interface SimpleTerminalProps {
  wsUrl: string;
  className?: string;
}

export const SimpleTerminal: React.FC<SimpleTerminalProps> = ({ wsUrl, className = '' }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { setConnected, clearOutput } = useTerminalStore();
  const terminalInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    terminalInstance.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1a1a1a',
        foreground: '#ffffff'
      }
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();

    terminalInstance.current.loadAddon(fitAddon);
    terminalInstance.current.loadAddon(webLinksAddon);
    terminalInstance.current.loadAddon(searchAddon);

    // Open terminal
    terminalInstance.current.open(terminalRef.current);
    fitAddon.fit();

    // Clear previous output
    clearOutput();

    // Connect to WebSocket
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      terminalInstance.current?.writeln('Connected to terminal server');
    };

    ws.onmessage = (event) => {
      terminalInstance.current?.writeln(event.data);
    };

    ws.onerror = (error) => {
      terminalInstance.current?.writeln('Error: Failed to connect to terminal server');
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setConnected(false);
      terminalInstance.current?.writeln('Disconnected from terminal server');
    };

    return () => {
      ws.close();
      terminalInstance.current?.dispose();
    };
  }, [wsUrl, setConnected, clearOutput]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 bg-[#1a1a1a] rounded-lg overflow-hidden p-4">
        <div 
          ref={terminalRef} 
          className="h-full"
        />
      </div>
    </div>
  );
}; 