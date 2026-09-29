import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  const moduleName = location.pathname.substring(1) || 'Page';

  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ textTransform: 'capitalize', marginBottom: '16px' }}>{moduleName}</h1>
      <p>This module is currently a stub.</p>
    </div>
  );
}
