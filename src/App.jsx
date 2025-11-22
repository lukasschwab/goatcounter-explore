import React, { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { TimeseriesGraph } from './components/TimeseriesGraph';
import { ControlPanel } from './components/ControlPanel';
import { processChartData } from './utils/dataProcessing';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [hiddenPaths, setHiddenPaths] = useState(new Set());

  const handleDataLoaded = ({ data, fileName }) => {
    setData(data);
    setFileName(fileName);
  };

  const { chartData, paths } = useMemo(() => processChartData(data), [data]);

  const filteredData = React.useMemo(() => {
    if (!data) return null;

    const sample = data[0];
    const keys = Object.keys(sample);
    const dateCol = keys.find(k =>
      k.toLowerCase().includes('created') ||
      k.toLowerCase().includes('date') ||
      k.toLowerCase().includes('time')
    );
    const pathCol = keys.find(k =>
      k.toLowerCase().includes('path')
    );

    if (!dateCol || !pathCol) return data;

    return data.filter(row => {
      const dateStr = row[dateCol];
      const path = row[pathCol];

      if (hiddenPaths.has(path)) return false;

      if (timeRange && dateStr) {
        if (dateStr < timeRange.start || dateStr > timeRange.end) return false;
      }

      return true;
    });
  }, [data, timeRange, hiddenPaths]);

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
          gridTemplateColumns: '1fr minmax(auto, 1200px) 1fr',
          gridTemplateRows: 'auto 1fr',
          gap: '2rem',
          padding: '2rem',
          alignItems: 'start'
        }}>
          {/* Header - Row 1, Col 2 */}
          <div style={{ gridColumn: '2', gridRow: '1' }}>
            <header className="header" style={{ marginBottom: 0 }}>
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
              />
            </div>
          </div>

          {/* Main Content - Row 2, Col 2 */}
          <div style={{ gridColumn: '2', gridRow: '2', width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500 }}>Traffic Overview</h2>
                <button
                  onClick={() => { setData(null); setFileName(null); setTimeRange(null); setHiddenPaths(new Set()); }}
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
              <DataTable data={filteredData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
