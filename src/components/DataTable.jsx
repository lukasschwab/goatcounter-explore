import React from 'react';
import { getSessionColor } from '../utils/dataProcessing';

export function DataTable({ data, onSessionSelect }) {
    if (!data || data.length === 0) return <div className="p-4 text-center text-gray-400">No data available</div>;

    const getWeight = (h) => {
        const lower = h.toLowerCase();
        if (lower.includes('session')) return -20;
        if (lower.includes('date') || lower.includes('created') || lower.includes('time')) return -10;
        if (h === 'Page') return -5;
        if (lower.includes('browser')) return 10;
        if (lower.includes('system')) return 20;
        return 0;
    };

    const allKeys = Object.keys(data[0]);
    const pathKey = allKeys.find(k => k.toLowerCase().includes('path'));
    const titleKey = allKeys.find(k => k.toLowerCase().includes('title'));

    const headers = allKeys
        .filter(h =>
            !h.toLowerCase().includes('event') &&
            !h.toLowerCase().includes('useragent') &&
            h !== pathKey &&
            h !== titleKey
        )
        .concat(['Page'])
        .sort((a, b) => getWeight(a) - getWeight(b));

    const sessionCol = headers.find(h => h.toLowerCase().includes('session'));
    const dateCol = headers.find(h => h.toLowerCase().includes('date') || h.toLowerCase().includes('created') || h.toLowerCase().includes('time'));

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                style={{
                                    padding: '0.75rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid var(--border)',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    position: 'sticky',
                                    top: 0,
                                    background: 'var(--bg-secondary)',
                                    zIndex: 10
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 100).map((row, i) => (
                        <tr
                            key={i}
                            style={{ borderBottom: '1px solid var(--border)' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {headers.map((header) => (
                                <td
                                    key={`${i}-${header}`}
                                    style={{
                                        padding: '0.75rem',
                                        color: header === dateCol ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        whiteSpace: 'nowrap',
                                        maxWidth: header === 'Page' ? 'none' : '300px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'top',
                                        fontFamily: header === dateCol ? 'monospace' : 'inherit'
                                    }}
                                    title={header === 'Page' ? `${row[titleKey]}\n${row[pathKey]}` : row[header]}
                                >
                                    {header === sessionCol ? (
                                        <button
                                            onClick={() => onSessionSelect(row[header])}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: getSessionColor(row[header]),
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                padding: 0,
                                                font: 'inherit',
                                                fontWeight: 500,
                                                opacity: 0.9,
                                                fontFamily: 'monospace'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.textDecoration = 'underline';
                                                e.currentTarget.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.textDecoration = 'none';
                                                e.currentTarget.style.opacity = '0.9';
                                            }}
                                        >
                                            {row[header].slice(0, 7)}
                                        </button>
                                    ) : header === 'Page' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ fontWeight: 500 }}>{row[titleKey] || '(No Title)'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{row[pathKey]}</div>
                                        </div>
                                    ) : (
                                        row[header]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length > 100 && (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', background: 'rgba(0,0,0,0.1)' }}>
                    Showing first 100 of {data.length.toLocaleString()} rows
                </div>
            )}
        </div>
    );
}
