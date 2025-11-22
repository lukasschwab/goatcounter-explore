import React from 'react';

export function DataTable({ data }) {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
        <div className="table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                        {headers.map(header => (
                            <th key={header} style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 100).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                            {headers.map(header => (
                                <td key={`${i}-${header}`} style={{ padding: '0.75rem' }}>
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length > 100 && (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Showing first 100 of {data.length} rows
                </div>
            )}
        </div>
    );
}
