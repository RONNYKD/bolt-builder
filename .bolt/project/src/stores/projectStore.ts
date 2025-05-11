import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProjectState {
  projectName: string;
  deploymentStatus: {
    lastDeployed: string | null;
    platform: 'netlify' | 'vercel' | null;
    url: string | null;
  };
  ownership: {
    type: 'personal' | 'team';
    name: string;
  };
  commandHistory: Array<{
    type: 'ai' | 'terminal';
    command: string;
    timestamp: string;
  }>;
  importedFiles: Record<string, string>;
  setProjectName: (name: string) => void;
  setDeploymentStatus: (status: ProjectState['deploymentStatus']) => void;
  setOwnership: (ownership: ProjectState['ownership']) => void;
  addCommandToHistory: (command: Omit<ProjectState['commandHistory'][0], 'timestamp'>) => void;
  setImportedFiles: (files: Record<string, string>) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projectName: '',
      deploymentStatus: {
        lastDeployed: null,
        platform: null,
        url: null,
      },
      ownership: {
        type: 'personal',
        name: '',
      },
      commandHistory: [],
      importedFiles: {},
      setProjectName: (name) => set({ projectName: name }),
      setDeploymentStatus: (status) => set({ deploymentStatus: status }),
      setOwnership: (ownership) => set({ ownership }),
      addCommandToHistory: (command) =>
        set((state) => ({
          commandHistory: [
            { ...command, timestamp: new Date().toISOString() },
            ...state.commandHistory,
          ].slice(0, 50), // Keep last 50 commands
        })),
      setImportedFiles: (files) => set({ importedFiles: files }),
    }),
    {
      name: 'bolt-project-store',
    }
  )
); 