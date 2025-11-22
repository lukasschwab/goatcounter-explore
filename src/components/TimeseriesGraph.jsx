import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../utils/dataProcessing';

export function TimeseriesGraph({ chartData, paths, hiddenPaths, onTimeRangeChange }) {
    const handleBrushChange = (e) => {
        if (onTimeRangeChange && e.startIndex !== undefined && e.endIndex !== undefined) {
            const startDate = chartData[e.startIndex]?.date;
            const endDate = chartData[e.endIndex]?.date;
            if (startDate && endDate) {
                onTimeRangeChange({ start: startDate, end: endDate });
            }
        }
    };

    if (!chartData || chartData.length === 0) return <div className="p-4 text-center text-gray-400">No compatible data found for graph.</div>;

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
                    <Brush
                        dataKey="date"
                        height={30}
                        stroke="#94a3b8"
                        fill="#1e293b"
                        tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                        onChange={handleBrushChange}
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
                            isAnimationActive={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
