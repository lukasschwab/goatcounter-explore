import React from 'react';
import { X, Monitor, Globe, MapPin, Clock } from 'lucide-react';
import { getSessionColor } from '../utils/dataProcessing';

export function SessionView({ sessionData, onClose }) {
    if (!sessionData || sessionData.length === 0) return null;

    // Extract session metadata from the first row (assuming consistent per session)
    const firstRow = sessionData[0];

    // Helper to find column case-insensitively
    const getVal = (keyPart) => {
        const key = Object.keys(firstRow).find(k => k.toLowerCase().includes(keyPart.toLowerCase()));
        return key ? firstRow[key] : 'Unknown';
    };

    const sessionId = getVal('session');
    const browser = getVal('browser');
    const system = getVal('system');
    const location = getVal('location');

    // Extract paths and sort by time
    const visits = sessionData.map(row => {
        const dateKey = Object.keys(row).find(k =>
            k.toLowerCase().includes('created') ||
            k.toLowerCase().includes('date') ||
            k.toLowerCase().includes('time')
        );
        const pathKey = Object.keys(row).find(k => k.toLowerCase().includes('path'));

        return {
            time: row[dateKey],
            path: row[pathKey]
        };
    }).sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Session Details</h3>
                    <div style={{
                        fontSize: '0.875rem',
                        color: getSessionColor(sessionId),
                        fontFamily: 'monospace',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'clip'
                    }} title={sessionId}>
                        {sessionId}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <Monitor size={16} color="var(--accent)" />
                    <span style={{ color: 'var(--text-primary)' }}>{browser}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>on {system}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <MapPin size={16} color="var(--accent)" />
                    <span style={{ color: 'var(--text-primary)' }}>{location}</span>
                </div>
            </div>

            <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Visit History ({visits.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {visits.map((visit, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: i < visits.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                                {i < visits.length - 1 && <div style={{ width: '1px', flex: 1, background: 'var(--border)' }} />}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{visit.path}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Clock size={12} />
                                    {new Date(visit.time).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
