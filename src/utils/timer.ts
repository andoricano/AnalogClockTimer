export const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

export const minutesToTime = (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const hrs = h.toString().padStart(2, '0');
    const mins = m.toString().padStart(2, '0');
    return `${hrs}:${mins}:00`;
};