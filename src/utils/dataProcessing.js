import { startOfDay } from 'date-fns';

export const COLORS = [
    '#38bdf8', '#fbbf24', '#34d399', '#f87171', '#a78bfa',
    '#f472b6', '#fb923c', '#a3e635', '#22d3ee', '#e879f9'
];

export function processChartData(data, groupBy = 'path') {
    if (!data || data.length === 0) return { chartData: [], paths: [] };

    // 1. Identify columns
    const sample = data[0];
    const keys = Object.keys(sample);
    const dateCol = keys.find(k =>
        k.toLowerCase().includes('created') ||
        k.toLowerCase().includes('date') ||
        k.toLowerCase().includes('time')
    );

    // Find column based on groupBy preference
    const groupCol = keys.find(k =>
        k.toLowerCase().includes(groupBy.toLowerCase())
    );

    if (!dateCol || !groupCol) {
        console.warn(`Could not identify Date or ${groupBy} columns. Keys found:`, keys);
        return { chartData: [], paths: [] };
    }

    // 2. Aggregate data
    const visitsByDay = {};

    data.forEach(row => {
        try {
            const dateStr = row[dateCol];
            if (!dateStr) return;

            const date = startOfDay(new Date(dateStr.replace(' ', 'T'))).toISOString();
            const group = row[groupCol] || '(none)'; // Handle missing values

            if (!visitsByDay[date]) {
                visitsByDay[date] = { date };
            }

            visitsByDay[date][group] = (visitsByDay[date][group] || 0) + 1;
        } catch (e) {
            console.error('Error processing row:', row, e);
        }
    });

    // 3. Transform to array and sort
    const chartData = Object.values(visitsByDay).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Extract groups
    const groupCounts = {};
    chartData.forEach(day => {
        Object.keys(day).forEach(key => {
            if (key !== 'date') {
                groupCounts[key] = (groupCounts[key] || 0) + day[key];
            }
        });
    });

    const paths = Object.entries(groupCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([group]) => group);

    return { chartData, paths };
}

export function getSessionColor(str) {
    if (!str) return 'var(--text-primary)';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 85%, 75%)`;
}
