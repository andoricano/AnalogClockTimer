import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialMinutes: number = 90) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60 * 1000);
    const [isRunning, setIsRunning] = useState(false);

    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);

    const animate = (time: number) => {
        if (previousTimeRef.current !== null) {
            const deltaTime = time - previousTimeRef.current;
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    setIsRunning(false);
                    return 0;
                }
                return Math.max(0, prev - deltaTime);
            });
        }
        previousTimeRef.current = time;
        if (isRunning) {
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (isRunning) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            previousTimeRef.current = null;
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isRunning]);

    const start = () => setIsRunning(true);
    const stop = () => setIsRunning(false);
    const reset = () => {
        setIsRunning(false);
        setTimeLeft(initialMinutes * 60 * 1000);
    };

    // 남은 시간으로 시, 분, 초 환산
    const totalSeconds = timeLeft / 1000;
    const hours = totalSeconds / 3600;
    const minutes = (totalSeconds % 3600) / 60;
    const seconds = totalSeconds % 60;

    // 3개 바늘 각도 계산
    const hoursDegrees = (hours % 12) * 30 + minutes * 0.5;
    const minutesDegrees = (minutes % 60) * 6;
    const secondsDegrees = seconds * 6;

    return {
        timeLeft,
        isRunning,
        start,
        stop,
        reset,
        angles: {
            hours: hoursDegrees,
            minutes: minutesDegrees,
            seconds: secondsDegrees,
        }
    };
};