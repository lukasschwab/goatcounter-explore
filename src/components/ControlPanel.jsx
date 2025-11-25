import React from 'react';
import { COLORS } from '../utils/dataProcessing';
import { Upload } from 'lucide-react';

export function ControlPanel({ paths, hiddenPaths, onHiddenPathsChange, fileName, onReset, counts }) {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={onReset}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    <Upload size={16} />
                    Upload New File
                </button>
                {fileName && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', wordBreak: 'break-all', textAlign: 'center' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{fileName}</span>
                    </div>
                )}
            </div>
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
                            minWidth: '30px',
                            textAlign: 'right',
                            color: hiddenPaths.has(path) ? 'var(--text-secondary)' : COLORS[index % COLORS.length],
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            fontVariantNumeric: 'tabular-nums',
                            paddingRight: '0.5rem',
                            flexShrink: 0
                        }}>
                            {counts ? (counts[path] || 0) : 0}
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={path}>
                            {path}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
