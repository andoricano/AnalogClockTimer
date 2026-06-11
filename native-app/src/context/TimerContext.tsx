import React, { createContext, useContext, useState, useEffect } from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import { appStorage } from '../utils/storage/appStorage';
import { defaultExamData, testStorage } from '../utils/storage/testStorage';

interface TimerContextType {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
    showTutorial: boolean;
    closeTutorial: () => Promise<void>;
    isAdReady: boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [isAdReady, setIsAdReady] = useState<boolean>(false);

    useEffect(() => {
        const checkTutorial = async () => {
            try {
                const isInit = await appStorage.getInitApp();
                if (isInit === null || isInit === true) {
                    await testStorage.setExamList([defaultExamData]);
                    await appStorage.setInitApp(false); 
                    setShowTutorial(true);
                }
            } catch (e) {
                console.log("[Init] Storage 초기화 에러:", e);
            }
        };
        checkTutorial();

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
                setIsAdReady(false);
            });
    }, []);

    const closeTutorial = async () => {
        setShowTutorial(false);
        // 위에서 이미 잠갔으므로 여기서는 상태창만 닫아주면 안전합니다.
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