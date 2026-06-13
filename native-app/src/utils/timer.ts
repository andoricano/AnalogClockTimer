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

export const timeToSeconds = (timeStr: string): number => {
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
};

export const secondsToTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};

export const formatTimeFromDate = (date: Date): string => {
    const hrs = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    const secs = date.getSeconds().toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};

// 총 시간을 계산해서 "X시간 Y분" 또는 "X분" 형태로 반환하는 함수
export const calculateTotalExamMinutes = (timeline: { startTime: string; endTime: string }[]): string => {
    let totalMinutes = 0;

    timeline.forEach(({ startTime, endTime }) => {
        let start = timeToMinutes(startTime);
        let end = timeToMinutes(endTime);

        if (end < start) {
            end += 1440;
        }

        totalMinutes += (end - start);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
    }
    return `${totalMinutes}분`;
};

export const formatToTimeString = (timeStr: string) => {
    if (!timeStr) return '00:00:00';

    const parts = timeStr.split(':');

    const hh = (Number(parts[0]) || 0).toString().padStart(2, '0');
    const mm = (Number(parts[1]) || 0).toString().padStart(2, '0');
    const ss = (Number(parts[2]) || 0).toString().padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
};