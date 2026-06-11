import React, { createContext, useContext, useState, useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { appStorage } from '../utils/storage/appStorage';

interface TimerContextType {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
    showTutorial: boolean;
    closeTutorial: () => Promise<void>;
    isAdReady: boolean; // 광고 준비 상태 추가
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [isAdReady, setIsAdReady] = useState<boolean>(false); // 광고 준비 상태 상태값

    useEffect(() => {
        // 1. 튜토리얼 확인 로직
        const checkTutorial = async () => {
            const isInit = await appStorage.getInitApp();
            if (isInit === null || isInit === true) {
                setShowTutorial(true);
            }
        };
        checkTutorial();

        // 2. AdMob 초기화 로직
        console.log("[AdMob] init start");
        mobileAds().setRequestConfiguration({
            testDeviceIdentifiers: ['109A7A12FEF994574AFE64F6ABA6D6E3']
        });

        mobileAds()
            .initialize()
            .then((adapterStatuses) => {
                console.log("[AdMob] init success:", adapterStatuses);
                setIsAdReady(true);
            })
            .catch((e) => {
                console.log("[AdMob] init failed:", e);
            });
    }, []);

    const closeTutorial = async () => {
        setShowTutorial(false);
        await appStorage.setInitApp(false);
    };

    return (
        <TimerContext.Provider value={{ clockMode, setClockMode, showTutorial, closeTutorial, isAdReady }}>
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