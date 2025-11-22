import { startOfDay } from 'date-fns';

export const COLORS = [
    '#38bdf8', '#fbbf24', '#34d399', '#f87171', '#a78bfa',
    '#f472b6', '#fb923c', '#a3e635', '#22d3ee', '#e879f9'
];

export function processChartData(data) {
    if (!data || data.length === 0) return { chartData: [], paths: [] };

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
        return { chartData: [], paths: [] };
    }

    // 2. Aggregate data
    const visitsByDay = {};

    data.forEach(row => {
        try {
            const dateStr = row[dateCol];
            if (!dateStr) return;

            const date = startOfDay(new Date(dateStr.replace(' ', 'T'))).toISOString();
            const path = row[pathCol];

            if (!visitsByDay[date]) {
                visitsByDay[date] = { date };
            }

            visitsByDay[date][path] = (visitsByDay[date][path] || 0) + 1;
        } catch (e) {
            console.error('Error processing row:', row, e);
        }
    });

    // 3. Transform to array and sort
    const chartData = Object.values(visitsByDay).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Extract paths
    const pathCounts = {};
    chartData.forEach(day => {
        Object.keys(day).forEach(key => {
            if (key !== 'date') {
                pathCounts[key] = (pathCounts[key] || 0) + day[key];
            }
        });
    });

    const paths = Object.entries(pathCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([path]) => path);

    return { chartData, paths };
}
