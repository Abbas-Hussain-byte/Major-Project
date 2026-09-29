import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import EligibilityPage from './pages/EligibilityPage';
import DocumentPage from './pages/DocumentPage';
import LiteracyPage from './pages/LiteracyPage';
import IncomePage from './pages/IncomePage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
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
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
