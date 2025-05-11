import { create } from 'zustand';
import { 
  getUserProjects, 
  getProject, 
  saveProject, 
  createNewProject, 
  deleteProject 
} from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  canvas_state: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  fetchProjects: (userId: string) => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (name: string, userId: string) => Promise<Project | null>;
  updateProject: (projectId: string, canvasState: any, name: string, userId: string) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  
  fetchProjects: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const projects = await getUserProjects(userId);
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        isLoading: false 
      });
    }
  },
  
  fetchProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const project = await getProject(projectId);
      
      if (project) {
        set({ currentProject: project, isLoading: false });
      } else {
        set({ 
          error: 'Project not found',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch project',
        isLoading: false 
      });
    }
  },
  
  createProject: async (name: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const newProject = await createNewProject(name, userId);
      
      if (newProject) {
        set(state => ({ 
          projects: [...state.projects, newProject],
          currentProject: newProject,
          isLoading: false 
        }));
        return newProject;
      } else {
        set({ 
          error: 'Failed to create project',
          isLoading: false 
        });
        return null;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false 
      });
      return null;
    }
  },
  
  updateProject: async (projectId: string, canvasState: any, name: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedProject = await saveProject(projectId, canvasState, name, userId);
      
      if (updatedProject) {
        set(state => ({ 
          projects: state.projects.map(p => 
            p.id === projectId ? updatedProject : p
          ),
          currentProject: updatedProject,
          isLoading: false 
        }));
      } else {
        set({ 
          error: 'Failed to update project',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update project',
        isLoading: false 
      });
    }
  },
  
  removeProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await deleteProject(projectId);
      
      if (success) {
        set(state => ({ 
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
          isLoading: false 
        }));
      } else {
        set({ 
          error: 'Failed to delete project',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete project',
        isLoading: false 
      });
    }
  },
  
  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  }
}));