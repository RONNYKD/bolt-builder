import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, FileCode, X } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import toast from 'react-hot-toast';

const templates = [
  { id: 'expo-mobile', name: 'Expo Mobile App', description: 'React Native mobile app template' },
  { id: 'astro-blog', name: 'Astro Blog', description: 'Fast static blog with Astro' },
  { id: 'vitepress-docs', name: 'VitePress Docs', description: 'Documentation site template' },
];

export const StartNewSection: React.FC = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const setImportedFiles = useProjectStore((state) => state.setImportedFiles);

  const handleImport = async () => {
    try {
      // Validate URL format
      if (!importUrl.match(/^(https?:\/\/)?(github\.com|stackblitz\.com)/)) {
        throw new Error('Invalid URL format');
      }

      // TODO: Implement actual import logic
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });

      if (!response.ok) throw new Error('Import failed');

      const files = await response.json();
      setImportedFiles(files);
      setShowImportModal(false);
      toast.success('Project imported successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Import failed');
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) throw new Error('Template loading failed');

      const files = await response.json();
      setImportedFiles(files);
      setShowTemplateModal(false);
      toast.success('Template loaded successfully!');
    } catch (error) {
      toast.error('Failed to load template');
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Start New</h2>
      <div className="space-y-2">
        <button
          onClick={() => setShowImportModal(true)}
          className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 rounded-lg"
        >
          <GitBranch className="w-5 h-5" />
          <span>Import Project</span>
        </button>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 rounded-lg"
        >
          <FileCode className="w-5 h-5" />
          <span>Use Template</span>
        </button>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Import Project</h3>
                <button onClick={() => setShowImportModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="Enter GitHub or StackBlitz URL"
                className="w-full p-2 border rounded-lg mb-4"
              />
              <button
                onClick={handleImport}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Import
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Choose Template</h3>
                <button onClick={() => setShowTemplateModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="w-full p-3 text-left hover:bg-gray-100 rounded-lg"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 