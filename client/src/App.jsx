import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import Home from './pages/Home';
import EligibilityPage from './pages/EligibilityPage';
import DocumentPage from './pages/DocumentPage';
import LiteracyPage from './pages/LiteracyPage';
import IncomePage from './pages/IncomePage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Universal Desktop Top Navbar & Floating Center Mic Dock */}
      <Navigation onMicClick={() => setIsVoiceModalOpen(true)} />

      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/documents" element={<DocumentPage />} />
          <Route path="/literacy" element={<LiteracyPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Universal Floating Voice Assistant Modal */}
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
