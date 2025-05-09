import React, { useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import toast from 'react-hot-toast';

const templates = [
  { name: 'Expo Mobile', id: 'expo' },
  { name: 'Astro Blog', id: 'astro' },
  { name: 'VitePress Docs', id: 'vitepress' },
];

export function StartNewSection() {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importInput, setImportInput] = useState('');
  const setImportedProject = useProjectStore((s) => s.setImportedProject);
  const setSelectedTemplate = useProjectStore((s) => s.setSelectedTemplate);

  const handleImport = () => {
    if (!importInput) {
      toast.error('Please enter a Git URL or StackBlitz ID');
      return;
    }
    setImportedProject({ url: importInput });
    setImportModalOpen(false);
    toast.success('Project imported (simulated)');
  };

  const handleTemplate = (id: string) => {
    if (!id) return;
    setSelectedTemplate(id);
    toast.success(`Template "${id}" loaded`);
    // TODO: Load template files and trigger AI explanation
  };

  return (
    <div className="p-4 border-b">
      <h3 className="font-semibold mb-2">Start New</h3>
      <button
        className="w-full mb-2 bg-blue-600 text-white py-2 rounded"
        onClick={() => setImportModalOpen(true)}
      >
        Import Project
      </button>
      <select
        className="w-full mb-2 border rounded p-2"
        defaultValue=""
        onChange={(e) => handleTemplate(e.target.value)}
      >
        <option value="" disabled>Use Template</option>
        {templates.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
        ))}
      </select>
      {importModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h4 className="font-bold mb-2">Import Project</h4>
            <input
              className="w-full border p-2 mb-4"
              placeholder="Git URL or StackBlitz ID"
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setImportModalOpen(false)} className="px-4 py-2">Cancel</button>
              <button onClick={handleImport} className="bg-blue-600 text-white px-4 py-2 rounded">Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 