import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialMinutes: number = 5) => {
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

    // 남은 시간을 초 단위(소수점 포함)로 변환하여 각도 계산
    const totalSeconds = timeLeft / 1000;
    const minutes = totalSeconds / 60;
    const seconds = totalSeconds % 60;

    // 1분 = 360도 / 60분 = 6도
    // 1초 = 360도 / 60초 = 6도
    const minutesDegrees = (minutes % 60) * 6;
    const secondsDegrees = seconds * 6;

    return {
        timeLeft,
        isRunning,
        start,
        stop,
        reset,
        angles: {
            minutes: minutesDegrees,
            seconds: secondsDegrees,
        }
    };
};