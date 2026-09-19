import React, { createContext, useContext, useState, useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { appStorage } from '../utils/storage/appStorage';
import { examTemplateList, testStorage } from '../utils/storage/testStorage';

interface TimerContextType {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
    isAdReady: boolean;
    isInitialized: boolean | null;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [isAdReady, setIsAdReady] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkInit = async () => {
            try {
                const isInit = await appStorage.getInitApp();

                if (isInit === null || isInit === true) {
                    setIsInitialized(false);

                    await testStorage.setExamList(examTemplateList);
                    await appStorage.setInitApp(false);

                    setIsInitialized(true);
                } else {
                    setIsInitialized(true);
                }
            } catch (e) {
                console.log("[Init] Storage 초기화 에러:", e);
                setIsInitialized(true);
            }
        };

        checkInit();

        console.log("[AdMob] init start");
        mobileAds()
            .initialize()
            .then((adapterStatuses) => {
                console.log("[AdMob] init success:", adapterStatuses);
                setIsAdReady(true);
            })
            .catch((e) => {
                console.log("[AdMob] init failed:", e);
                setIsAdReady(false);
            });

    }, []);

    return (
        <TimerContext.Provider value={{ clockMode, setClockMode, isAdReady, isInitialized }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
};