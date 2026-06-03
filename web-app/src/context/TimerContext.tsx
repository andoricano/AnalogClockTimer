import React, { createContext, useContext, useState } from 'react';

interface TimerContextType {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
    startTime: number | null;
    endTime: number | null;
    setTimerRange: (start: number | null, end: number | null) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clockMode, setClockMode] = useState<boolean>(true);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);

    const setTimerRange = (start: number | null, end: number | null) => {
        setStartTime(start);
        setEndTime(end);
    };

    return (
        <TimerContext.Provider value={{ clockMode, setClockMode, startTime, endTime, setTimerRange }}>
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