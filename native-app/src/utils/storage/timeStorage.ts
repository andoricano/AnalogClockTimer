import { storage } from "./storage";

const TIMER_KEYS = {
    TIME: 'timer_time',
    MINUTE: 'timer_minute',
} as const;

export const timerStorage = {
    setTime: async (hh: string, mm: string, ss: string) => {
        await storage.set(TIMER_KEYS.TIME, {
            hh,
            mm,
            ss,
        });
    },

    getTime: async () => {
        const value = await storage.get(TIMER_KEYS.TIME);

        if (!value) return null;

        return {
            hh: value.hh,
            mm: value.mm,
            ss: value.ss,
        };
    },

    clearTime: async () => {
        await storage.remove(TIMER_KEYS.TIME);
    },

    // 👉 minute 전용 추가
    setMinute: async (minute: number) => {
        await storage.set(TIMER_KEYS.MINUTE, minute);
    },

    getMinute: async (): Promise<number | null> => {
        const value = await storage.get(TIMER_KEYS.MINUTE);

        if (value === null || value === undefined) return null;

        return Number(value);
    },

    clearMinute: async () => {
        await storage.remove(TIMER_KEYS.MINUTE);
    },
};