import React, { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { TimeseriesGraph } from './components/TimeseriesGraph';
import { ControlPanel } from './components/ControlPanel';
import { processChartData } from './utils/dataProcessing';
import './App.css';

import { SessionView } from './components/SessionView';

function App() {
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [hiddenPaths, setHiddenPaths] = useState(new Set());
  const [activeTab, setActiveTab] = useState('path'); // 'path' or 'referrer'
  const [selectedSession, setSelectedSession] = useState(null);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('gc_explore_data');
      const savedFileName = localStorage.getItem('gc_explore_filename');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
      if (savedFileName) {
        setFileName(savedFileName);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  }, []);

  // Save to localStorage when data changes
  React.useEffect(() => {
    if (data) {
      try {
        localStorage.setItem('gc_explore_data', JSON.stringify(data));
        localStorage.setItem('gc_explore_filename', fileName);
      } catch (e) {
        console.warn('Failed to save to localStorage (likely quota exceeded):', e);
      }
    } else {
      localStorage.removeItem('gc_explore_data');
      localStorage.removeItem('gc_explore_filename');
    }
  }, [data, fileName]);

  const handleDataLoaded = ({ data, fileName }) => {
    setData(data);
    setFileName(fileName);
    // Reset state on new file
    setHiddenPaths(new Set());
    setTimeRange(null);
    setSelectedSession(null);
  };

  const handleReset = () => {
    setData(null);
    setFileName(null);
    setTimeRange(null);
    setHiddenPaths(new Set());
    setSelectedSession(null);
    localStorage.removeItem('gc_explore_data');
    localStorage.removeItem('gc_explore_filename');
  };

  // Reset hidden paths when tab changes
  React.useEffect(() => {
    setHiddenPaths(new Set());
  }, [activeTab]);

  const { chartData, paths } = useMemo(() => processChartData(data, activeTab), [data, activeTab]);

  const counts = useMemo(() => {
    if (!chartData) return {};
    const newCounts = {};
    chartData.forEach(day => {
      if (timeRange) {
        if (day.date < timeRange.start || day.date > timeRange.end) return;
      }
      paths.forEach(path => {
        if (day[path]) {
          newCounts[path] = (newCounts[path] || 0) + day[path];
        }
      });
    });
    return newCounts;
  }, [chartData, paths, timeRange]);

  const filteredData = React.useMemo(() => {
    if (!data) return null;

    const sample = data[0];
    const keys = Object.keys(sample);
    const dateCol = keys.find(k =>
      k.toLowerCase().includes('created') ||
      k.toLowerCase().includes('date') ||
      k.toLowerCase().includes('time')
    );
    const groupCol = keys.find(k =>
      k.toLowerCase().includes(activeTab.toLowerCase())
    );

    if (!dateCol || !groupCol) return data;

    return data.filter(row => {
      const dateStr = row[dateCol];
      const group = row[groupCol] || '(none)';

      if (hiddenPaths.has(group)) return false;

      if (timeRange && dateStr) {
        if (dateStr < timeRange.start || dateStr > timeRange.end) return false;
      }

      return true;
    });
  }, [data, timeRange, hiddenPaths, activeTab]);

  const sessionData = React.useMemo(() => {
    if (!data || !selectedSession) return null;
    const sessionCol = Object.keys(data[0]).find(k => k.toLowerCase().includes('session'));
    if (!sessionCol) return null;
    return data.filter(row => row[sessionCol] === selectedSession);
  }, [data, selectedSession]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {!data ? (
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
          <div className="card">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedSession
            ? '1fr minmax(auto, 1200px) 1fr 320px'
            : '1fr minmax(auto, 1200px) 1fr',
          gridTemplateRows: 'auto 1fr',
          gap: '2rem',
          padding: '2rem',
          alignItems: 'start',
          transition: 'all 0.3s ease'
        }}>
          {/* Header - Row 1, Col 2 */}
          <div style={{ gridColumn: '2', gridRow: '1' }}>
            <header className="header" style={{ marginBottom: 0, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex'
                }}>
                  <BarChart3 color="white" size={24} />
                </div>
                <h1>GoatCounter Explore</h1>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <button
                  onClick={() => setActiveTab('path')}
                  style={{
                    background: activeTab === 'path' ? 'var(--bg-primary)' : 'transparent',
                    color: activeTab === 'path' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    boxShadow: activeTab === 'path' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Traffic
                </button>
                <button
                  onClick={() => setActiveTab('referrer')}
                  style={{
                    background: activeTab === 'referrer' ? 'var(--bg-primary)' : 'transparent',
                    color: activeTab === 'referrer' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    boxShadow: activeTab === 'referrer' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Referrers
                </button>
              </div>
            </header>
          </div>

          {/* Control Panel - Row 2, Col 1 */}
          <div style={{
            gridColumn: '1',
            gridRow: '2',
            justifySelf: 'end',
            width: '280px',
            position: 'sticky',
            top: '2rem',
            maxHeight: 'calc(100vh - 4rem)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '1rem' }}>Controls</h2>
              <ControlPanel
                paths={paths}
                hiddenPaths={hiddenPaths}
                onHiddenPathsChange={setHiddenPaths}
                fileName={fileName}
                onReset={handleReset}
                counts={counts}
              />
            </div>
          </div>

          {/* Main Content - Row 2, Col 2 */}
          <div style={{ gridColumn: '2', gridRow: '2', width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                  {activeTab === 'path' ? 'Traffic Overview' : 'Referrer Overview'}
                </h2>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <TimeseriesGraph
                  chartData={chartData}
                  paths={paths}
                  hiddenPaths={hiddenPaths}
                  onTimeRangeChange={setTimeRange}
                />
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                  Raw Data Preview {timeRange && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 400 }}>(Filtered)</span>}
                </h2>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {filteredData ? filteredData.length.toLocaleString() : 0} rows
                </span>
              </div>
              <DataTable data={filteredData} onSessionSelect={setSelectedSession} />
            </div>
          </div>

          {/* Session View - Row 2, Col 3 (Optional) */}
          {selectedSession && (
            <div style={{
              gridColumn: '3',
              gridRow: '2',
              width: '320px',
              position: 'sticky',
              top: '2rem',
              maxHeight: 'calc(100vh - 4rem)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="card" style={{ height: '100%', overflowY: 'auto' }}>
                <SessionView sessionData={sessionData} onClose={() => setSelectedSession(null)} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
