import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface XTermTerminalProps {
  wsUrl: string;
}

export const XTermTerminal: React.FC<XTermTerminalProps> = ({ wsUrl }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    term.current = new Terminal({
      fontSize: 14,
      theme: { background: '#1a1a1a', foreground: '#fff' },
      cursorBlink: true,
      rows: 20,
    });
    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    ws.current = new WebSocket(wsUrl);
    ws.current.onopen = () => {
      term.current?.writeln('Connected to backend terminal.');
    };
    ws.current.onmessage = (event) => {
      term.current?.writeln(event.data);
    };
    ws.current.onclose = () => {
      term.current?.writeln('Connection closed.');
    };
    ws.current.onerror = () => {
      term.current?.writeln('WebSocket error.');
    };

    term.current.onData((data: string) => {
      ws.current?.send(data);
    });

    window.addEventListener('resize', () => fitAddon.current?.fit());
    return () => {
      ws.current?.close();
      term.current?.dispose();
    };
  }, [wsUrl]);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
}; 