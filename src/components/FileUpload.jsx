import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';

export function FileUpload({ onDataLoaded }) {
  const handleFile = useCallback((file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded(results.data);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file');
      }
    });
  }, [onDataLoaded]);

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFile(file);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div 
      className="upload-zone"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        border: '2px dashed var(--border)',
        borderRadius: '0.75rem',
        padding: '3rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}
    >
      <Upload size={48} strokeWidth={1.5} />
      <div>
        <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.5rem' }}>
          Drop your GoatCounter CSV export here
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          or <label htmlFor="file-upload" style={{ color: 'var(--accent)', cursor: 'pointer' }}>browse files</label>
        </p>
      </div>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={onChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
