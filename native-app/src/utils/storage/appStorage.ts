import { storage } from "./storage";

const APP_KEYS = {
    INIT_APP: 'init_app',
} as const;

export const appStorage = {
    setInitApp: async (init: boolean) => {
        await storage.set(APP_KEYS.INIT_APP, init);
    },

    getInitApp: async (): Promise<boolean | null> => {
        const value = await storage.get(APP_KEYS.INIT_APP);
        return value as boolean | null;
    },
};