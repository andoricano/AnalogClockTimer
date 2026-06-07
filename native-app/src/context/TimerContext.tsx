import React, { createContext, useContext, useState, useEffect } from 'react';
import { appStorage } from '../utils/storage/appStorage';

interface TimerContextType {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
    showTutorial: boolean;
    closeTutorial: () => Promise<void>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [showTutorial, setShowTutorial] = useState<boolean>(false);

    useEffect(() => {
        const checkTutorial = async () => {
            const isInit = await appStorage.getInitApp();
            if (isInit === null || isInit === true) {
                setShowTutorial(true);
            }
        };
        checkTutorial();
    }, []);

    const closeTutorial = async () => {
        setShowTutorial(false);
        await appStorage.setInitApp(false);
    };

    return (
        <TimerContext.Provider value={{ clockMode, setClockMode, showTutorial, closeTutorial }}>
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