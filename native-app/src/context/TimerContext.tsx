import React, { createContext, useContext, useState } from 'react';

interface TimerContextType {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clockMode, setClockMode] = useState<boolean>(false);

    return (
        <TimerContext.Provider value={{ clockMode, setClockMode }}>
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