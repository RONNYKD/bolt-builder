import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import 'xterm/css/xterm.css';

interface CloudTerminalProps {
  wsUrl: string;
  className?: string;
}

export const CloudTerminal: React.FC<CloudTerminalProps> = ({ wsUrl, className = '' }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1a1a1a',
        foreground: '#ffffff',
      },
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.loadAddon(searchAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    // Connect to WebSocket
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      term.writeln('Connected to terminal server');
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onerror = (error) => {
      term.writeln('\r\n\x1b[31mError: Failed to connect to terminal server\x1b[0m');
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      term.writeln('\r\n\x1b[31mDisconnected from terminal server\x1b[0m');
    };

    term.onData((data) => {
      ws.send(data);
    });

    // Handle terminal resize
    const handleResize = () => {
      fitAddon.fit();
      ws.send(JSON.stringify({ 
        type: 'resize', 
        cols: term.cols, 
        rows: term.rows 
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      ws.close();
    };
  }, [wsUrl]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 bg-[#1a1a1a] rounded-lg overflow-hidden">
        <div ref={terminalRef} className="h-full" />
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Press Enter to execute commands. Use ↑/↓ to navigate command history.
      </div>
    </div>
  );
}; 