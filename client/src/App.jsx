import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main Modules mapped to Placeholder for now */}
          <Route path="/eligibility" element={<Placeholder />} />
          <Route path="/documents" element={<Placeholder />} />
          <Route path="/literacy" element={<Placeholder />} />
          <Route path="/income" element={<Placeholder />} />
          <Route path="/profile" element={<Placeholder />} />
          
          <Route path="*" element={<Placeholder />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
