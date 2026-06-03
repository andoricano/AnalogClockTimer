import React, { createContext, useContext, useState } from 'react';

interface TimerContextType {
    startTime: number | null;
    endTime: number | null;
    setTimerRange: (start: number | null, end: number | null) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);

    const setTimerRange = (start: number | null, end: number | null) => {
        setStartTime(start);
        setEndTime(end);
    };

    return (
        <TimerContext.Provider value={{ startTime, endTime, setTimerRange }}>
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