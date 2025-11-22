import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { format, parseISO, startOfDay } from 'date-fns';

const COLORS = [
    '#38bdf8', '#fbbf24', '#34d399', '#f87171', '#a78bfa',
    '#f472b6', '#fb923c', '#a3e635', '#22d3ee', '#e879f9'
];

export function TimeseriesGraph({ data }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // 1. Identify columns
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

        if (!dateCol || !pathCol) {
            console.warn('Could not identify Date or Path columns. Keys found:', keys);
            return [];
        }

        // 2. Aggregate data
        const visitsByDay = {};
        const allPaths = new Set();

        data.forEach(row => {
            try {
                const dateStr = row[dateCol];
                if (!dateStr) return;

                // Handle various date formats if needed, but assuming ISO or standard string for now
                // GoatCounter export usually has '2023-10-27 10:00:00'
                const date = startOfDay(new Date(dateStr.replace(' ', 'T'))).toISOString();
                const path = row[pathCol];

                if (!visitsByDay[date]) {
                    visitsByDay[date] = { date };
                }

                visitsByDay[date][path] = (visitsByDay[date][path] || 0) + 1;
                allPaths.add(path);
            } catch (e) {
                console.error('Error processing row:', row, e);
            }
        });

        // 3. Transform to array and sort
        return Object.values(visitsByDay).sort((a, b) => a.date.localeCompare(b.date));
    }, [data]);

    // Get top 10 paths by total volume to assign colors/show in legend, hide others or group them?
    // For now, let's just show all paths but maybe limit if too many.
    // Actually, user said "each of the visited pages". If there are hundreds, this will be messy.
    // Let's implement a limit or just render them all and let the user filter via legend (Recharts default behavior).
    // To avoid crashing with too many lines, let's pick top 20 active paths.

    const paths = useMemo(() => {
        if (chartData.length === 0) return [];
        const pathCounts = {};
        chartData.forEach(day => {
            Object.keys(day).forEach(key => {
                if (key !== 'date') {
                    pathCounts[key] = (pathCounts[key] || 0) + day[key];
                }
            });
        });

        return Object.entries(pathCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20) // Limit to top 20 for performance/readability
            .map(([path]) => path);
    }, [chartData]);

    const [hiddenPaths, setHiddenPaths] = React.useState(new Set());

    const handleLegendClick = (e) => {
        const { dataKey } = e;
        setHiddenPaths(prev => {
            const next = new Set(prev);
            if (next.has(dataKey)) {
                next.delete(dataKey);
            } else {
                next.add(dataKey);
            }
            return next;
        });
    };

    if (chartData.length === 0) return <div className="p-4 text-center text-gray-400">No compatible data found for graph.</div>;

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                        stroke="#94a3b8"
                    />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        labelFormatter={(str) => format(parseISO(str), 'MMM d, yyyy')}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }}
                        onClick={handleLegendClick}
                        formatter={(value, entry) => {
                            const { dataKey } = entry;
                            return <span style={{ color: hiddenPaths.has(dataKey) ? '#64748b' : 'inherit', textDecoration: hiddenPaths.has(dataKey) ? 'line-through' : 'none' }}>{value}</span>;
                        }}
                    />
                    <Brush
                        dataKey="date"
                        height={30}
                        stroke="#94a3b8"
                        fill="#1e293b"
                        tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                    />
                    {paths.map((path, index) => (
                        <Line
                            key={path}
                            type="linear"
                            dataKey={path}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                            connectNulls
                            hide={hiddenPaths.has(path)}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
