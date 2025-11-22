import React from 'react';
import { COLORS } from '../utils/dataProcessing';

export function ControlPanel({ paths, hiddenPaths, onHiddenPathsChange, fileName }) {
    const handlePathToggle = (path) => {
        onHiddenPathsChange(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    const handleShowAll = () => onHiddenPathsChange(new Set());
    const handleHideAll = () => onHiddenPathsChange(new Set(paths));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            {fileName && (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                    File: <span style={{ color: 'var(--text-primary)' }}>{fileName}</span>
                </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={handleShowAll}
                    style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                    }}
                >
                    Show All
                </button>
                <button
                    onClick={handleHideAll}
                    style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                    }}
                >
                    Hide All
                </button>
            </div>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
            }}>
                {paths.map((path, index) => (
                    <div
                        key={path}
                        onClick={() => handlePathToggle(path)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            opacity: hiddenPaths.has(path) ? 0.5 : 1,
                            textDecoration: hiddenPaths.has(path) ? 'line-through' : 'none',
                            color: hiddenPaths.has(path) ? 'var(--text-secondary)' : 'var(--text-primary)',
                            borderRadius: '0.25rem',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: hiddenPaths.has(path) ? 'var(--text-secondary)' : COLORS[index % COLORS.length],
                            flexShrink: 0
                        }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={path}>
                            {path}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
