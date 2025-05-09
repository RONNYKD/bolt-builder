import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PricingPage } from './pages/PricingPage';
import { AIBuilderPage } from './pages/AIBuilderPage';
import { PromptInput } from './components/ai/PromptInput';
import { GeminiTest } from './components/ai/GeminiTest';
import { initializeAuth } from './store/authStore';

function App() {
  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribe = initializeAuth();
    
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/editor/:projectId" element={<EditorPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/ai-builder" element={<AIBuilderPage />} />
            <Route path="/prompt" element={<PromptInput onPromptSubmit={() => {
              // This will be handled by the navigation in PromptInput
            }} />} />
            <Route path="/test-gemini" element={<GeminiTest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;