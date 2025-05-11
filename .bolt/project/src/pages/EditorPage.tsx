import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Code, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Canvas } from '../components/canvas/Canvas';
import { AIComponentGenerator } from '../components/canvas/AIComponentGenerator';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';

export const EditorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthStore();
  const { 
    currentProject, 
    isLoading, 
    error,
    fetchProject,
    updateProject
  } = useProjectStore();
  
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, user, fetchProject, navigate]);

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
    }
  }, [currentProject]);

  const handleSave = async () => {
    if (!user || !currentProject || !projectId) return;
    
    setIsSaving(true);
    
    try {
      await updateProject(
        projectId,
        currentProject.canvas_state,
        projectName,
        user.uid
      );
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCanvasChange = (canvasState: any) => {
    if (currentProject && projectId && user) {
      // We don't need to call updateProject here for every change
      // Just update the local state
      useProjectStore.setState({
        currentProject: {
          ...currentProject,
          canvas_state: canvasState
        }
      });
    }
  };

  const handleComponentGenerated = (code: string) => {
    setGeneratedCode(code);
    // Here we would parse the code and add it to the canvas
    // For now, we'll just show it in a panel
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-700 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                leftIcon={<ArrowLeft className="h-5 w-5" />}
              >
                Back
              </Button>
              <div className="ml-4">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="font-semibold text-lg"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAIPanel(!showAIPanel)}
                leftIcon={<Code className="h-5 w-5" />}
              >
                {showAIPanel ? 'Hide AI Panel' : 'AI Generator'}
              </Button>
              <Button
                variant="outline"
                leftIcon={<Download className="h-5 w-5" />}
              >
                Export
              </Button>
              <Button
                onClick={handleSave}
                leftIcon={<Save className="h-5 w-5" />}
                isLoading={isSaving}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Canvas */}
        <div className={`flex-1 ${showAIPanel ? 'w-2/3' : 'w-full'}`}>
          <Canvas
            initialState={currentProject.canvas_state}
            onSave={handleCanvasChange}
          />
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div className="w-1/3 bg-white border-l border-gray-200 p-4 overflow-auto">
            <div className="mb-6">
              <AIComponentGenerator onComponentGenerated={handleComponentGenerated} />
            </div>
            
            {generatedCode && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Code</h3>
                <div className="bg-gray-800 rounded-md p-4 overflow-auto">
                  <pre className="text-sm text-white">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    onClick={() => {
                      // Here we would add the component to the canvas
                      // For now, just clear the code
                      setGeneratedCode('');
                    }}
                  >
                    Add to Canvas
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};