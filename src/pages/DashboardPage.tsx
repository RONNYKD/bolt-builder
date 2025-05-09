import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Folder, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';

export const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuthStore();
  const { 
    projects, 
    isLoading: isProjectLoading, 
    error,
    fetchProjects,
    createProject,
    removeProject
  } = useProjectStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects(user.uid);
    }
  }, [user, fetchProjects]);

  const handleCreateProject = async () => {
    if (!user || !newProjectName.trim()) return;
    
    const project = await createProject(newProjectName.trim(), user.uid);
    
    if (project) {
      setNewProjectName('');
      setIsCreating(false);
      navigate(`/editor/${project.id}`);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    await removeProject(projectId);
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-black mb-8">Welcome, {user?.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Builder Card */}
        <Link to="/prompt" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-2">AI App Builder</h2>
            <p className="text-gray-600 mb-4">
              Create a new app using AI. Just describe what you want, and our AI will generate it for you.
            </p>
            <div className="flex items-center text-blue-600">
              <span>Start Building</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Test Gemini Card */}
        <Link to="/test-gemini" className="block">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Test Gemini API</h2>
            <p className="text-gray-600 mb-4">
              Test the Gemini API integration and see the response format.
            </p>
            <div className="flex items-center text-blue-600">
              <span>Test API</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Existing Projects Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Your Projects</h2>
          <p className="text-gray-600 mb-4">
            View and manage your existing projects.
          </p>
          <div className="text-gray-500">
            No projects yet
          </div>
        </div>

        {/* Templates Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Templates</h2>
          <p className="text-gray-600 mb-4">
            Start with a pre-built template.
          </p>
          <div className="text-gray-500">
            Coming soon
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-4">My Projects</h1>
            <Button
              onClick={() => setIsCreating(true)}
              leftIcon={<Plus className="h-5 w-5" />}
            >
              New Project
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isCreating && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h2>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Input
                    label="Project Name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                    fullWidth
                  />
                </div>
                <Button onClick={handleCreateProject}>Create</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {isProjectLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <Folder className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {project.name}
                          </dt>
                          <dd>
                            <div className="text-sm text-gray-900">
                              Last updated: {new Date(project.updated_at).toLocaleDateString()}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between">
                    <Link to={`/editor/${project.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ExternalLink className="h-4 w-4" />}
                      >
                        Open Editor
                      </Button>
                    </Link>
                    {deleteConfirmId === project.id ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(project.id)}
                        leftIcon={<Trash2 className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-12 sm:px-6 text-center">
                <Folder className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => setIsCreating(true)}
                    leftIcon={<Plus className="h-5 w-5" />}
                  >
                    New Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};