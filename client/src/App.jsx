import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import VoiceAssistantModal from './components/VoiceAssistantModal';

const Home = lazy(() => import('./pages/Home'));
const EligibilityPage = lazy(() => import('./pages/EligibilityPage'));
const DocumentPage = lazy(() => import('./pages/DocumentPage'));
const LiteracyPage = lazy(() => import('./pages/LiteracyPage'));
const IncomePage = lazy(() => import('./pages/IncomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

function AppContent() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Universal Desktop Top Navbar & Floating Center Mic Dock */}
      <Navigation onMicClick={() => setIsVoiceModalOpen(true)} />

      <main className="main-content-area">
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="spinner-large" style={{ width: 40, height: 40, border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          </div>
        }>
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
        </Suspense>
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
