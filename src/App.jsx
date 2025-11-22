import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  return (
    <div className="app-container">
      <header className="header">
        <div style={{
          background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          display: 'flex'
        }}>
          <BarChart3 color="white" size={24} />
        </div>
        <h1>GoatCounter Explore</h1>
      </header>

      {!data ? (
        <div className="card">
          <FileUpload onDataLoaded={setData} />
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 500 }}>Raw Data Preview</h2>
            <button
              onClick={() => setData(null)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              Upload New File
            </button>
          </div>
          <DataTable data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
