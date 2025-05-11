import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TerminalTest } from './pages/TerminalTest';
import { Toaster } from 'react-hot-toast';
import { AIBuilderPage } from './pages/AIBuilderPage';
import { NoCodeBuilderPage } from './pages/NoCodeBuilderPage';
import { DeploymentStatus } from './components/DeploymentStatus';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <DeploymentStatus />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TerminalTest />} />
            <Route path="/ai-builder" element={<AIBuilderPage />} />
            <Route path="/no-code-builder" element={<NoCodeBuilderPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;