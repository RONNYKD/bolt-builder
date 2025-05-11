import { create } from 'zustand';

interface TerminalState {
  isConnected: boolean;
  output: string[];
  setConnected: (connected: boolean) => void;
  addOutput: (line: string) => void;
  clearOutput: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isConnected: false,
  output: [],
  setConnected: (connected) => set({ isConnected: connected }),
  addOutput: (line) => set((state) => ({ 
    output: [...state.output, line] 
  })),
  clearOutput: () => set({ output: [] }),
})); 