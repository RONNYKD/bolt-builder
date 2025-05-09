import create from 'zustand';

interface Project {
  url: string;
}

export const useProjectStore = create<{
  importedProject: Project | null;
  selectedTemplate: string | null;
  setImportedProject: (project: Project) => void;
  setSelectedTemplate: (template: string) => void;
}>(set => ({
  importedProject: null,
  selectedTemplate: null,
  setImportedProject: (project: Project) => set({ importedProject: project }),
  setSelectedTemplate: (template: string) => set({ selectedTemplate: template }),
})); 