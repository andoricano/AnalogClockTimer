import { useState, useEffect } from 'react';
import { timeToSeconds, secondsToTime, formatTimeFromDate } from '../utils/timer';

export type TimerStatus = 'READY' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export const useTimer = () => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string>('09:00:00');
    const [endTime, setEndTime] = useState<string>('10:20:00');
    const [timerStatus, setTimerStatus] = useState<TimerStatus>('READY');
    const [renderingTime, setRenderingTime] = useState<string>('09:00:00');

    useEffect(() => {
        if (clockMode) {
            const updateCurrentTime = () => {
                setRenderingTime(formatTimeFromDate(new Date()));
            };
            updateCurrentTime();
            const intervalId = setInterval(updateCurrentTime, 1000);
            return () => clearInterval(intervalId);
        }

        if (timerStatus !== 'RUNNING') {
            return;
        }

        const targetSeconds = timeToSeconds(endTime);
        const startSeconds = timeToSeconds(startTime);
        let effectiveTargetSeconds = targetSeconds;

        if (effectiveTargetSeconds < startSeconds) {
            effectiveTargetSeconds += 86400;
        }

        const intervalId = setInterval(() => {
            setRenderingTime((prevTime) => {
                let currentSeconds = timeToSeconds(prevTime);
                const nextSeconds = currentSeconds + 1;

                if (nextSeconds >= effectiveTargetSeconds) {
                    setTimerStatus('FINISHED');
                    return endTime;
                } else {
                    return secondsToTime(nextSeconds);
                }
            });
        }, 1000);

        return () => clearInterval(intervalId);

    }, [clockMode, timerStatus, startTime, endTime]);

    const start = () => {
        if (timerStatus === 'READY' || timerStatus === 'FINISHED') {
            setRenderingTime(startTime);
        }
        setTimerStatus('RUNNING');
    };

    const stop = () => {
        setTimerStatus('PAUSED');
    };

    const setRenderStartTime = () => {
        if (timerStatus === 'READY' || timerStatus === 'PAUSED') {
            setRenderingTime(startTime);
        }
    };

    const setTimeRange = (newStart: string, newEnd: string): boolean => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        if (!timeRegex.test(newStart) || !timeRegex.test(newEnd)) {
            console.log('🚨 [setTimeRange] 형식 오류:', { newStart, newEnd });
            return false;
        }

        setStartTime(newStart);
        setEndTime(newEnd);
        return true;
    };

    return {
        clockMode,
        setClockMode,
        startTime,
        endTime,
        setTimeRange,
        timerStatus,
        setTimerStatus,
        renderingTime,
        setRenderStartTime,
        start,
        stop
    };
};