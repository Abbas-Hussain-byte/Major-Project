import React, { useState, useRef } from 'react';
import { FileText, Camera, Upload } from 'lucide-react';
import MicButton from '../components/MicButton';

export default function DocumentPage() {
  const [micState, setMicState] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleMicClick = () => {
    if (micState === 'idle') setMicState('listening');
    else if (micState === 'listening') setMicState('error');
    else setMicState('idle');
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <FileText size={32} color="var(--color-documents-bg)" aria-hidden="true" />
          <span>Documents</span>
        </h1>
        <p>Upload Ration card, Aadhaar, or Income certificate</p>
      </header>

      <main className="page-content">
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*,application/pdf" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          aria-label="Upload document file"
        />

        <section aria-label="Upload document" className="empty-state-box">
          <Upload size={48} color="#004488" aria-hidden="true" />
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-dark)' }}>
            {selectedFile ? `Selected: ${selectedFile}` : 'Upload your document'}
          </h2>
          <p>Take a photo or choose a document file to extract benefits automatically.</p>
        </section>

        <button 
          type="button" 
          className="btn-primary btn-documents"
          onClick={handleTriggerUpload}
          aria-label="Upload document from camera or file"
        >
          <Camera size={28} aria-hidden="true" />
          <span>Upload Document (Camera or File)</span>
        </button>
      </main>

      <footer className="mic-section">
        <MicButton state={micState} onClick={handleMicClick} />
      </footer>
    </div>
  );
}
