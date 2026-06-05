import { useState, useEffect } from 'react';
import { timeToSeconds, secondsToTime, formatTimeFromDate } from '../utils/timer';
import { timerStorage } from '../utils/storage/timeStorage';

export type TimerStatus = 'READY' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export const useTimer = () => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string>('09:00:00');
    const [endTime, setEndTime] = useState<string>('09:00:10');
    const [timerStatus, setTimerStatus] = useState<TimerStatus>('READY');
    const [renderingTime, setRenderingTime] = useState<string>('09:00:00');

    useEffect(() => {
        const load = async () => {
            const start = await timerStorage.getStartTime();
            const end = await timerStorage.getEndTime();

            console.log("LOAD", start, end);

            if (start) setStartTime(start);
            if (end) setEndTime(end);
        };

        load();
    }, []);


    useEffect(() => {
        if (timerStatus === 'READY') {
            setRenderingTime(startTime);
        }
    }, [startTime, timerStatus]);

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

        const startSeconds = timeToSeconds(startTime);
        let targetSeconds = timeToSeconds(endTime);

        if (targetSeconds < startSeconds) {
            targetSeconds += 86400;
        }

        const intervalId = setInterval(() => {
            let currentSeconds = timeToSeconds(renderingTime);

            if (currentSeconds < startSeconds) {
                currentSeconds += 86400;
            }

            const nextSeconds = currentSeconds + 1;

            if (nextSeconds >= targetSeconds) {
                clearInterval(intervalId);
                setRenderingTime(endTime);
                setTimerStatus('FINISHED');
            } else {
                setRenderingTime(secondsToTime(nextSeconds % 86400));
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [clockMode, timerStatus, startTime, endTime, renderingTime]);

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
        setTimerStatus('READY');
        setRenderingTime(startTime);
    };


    const setTimeRange = (newStart: string, newEnd: string): boolean => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        if (!timeRegex.test(newStart) || !timeRegex.test(newEnd)) {
            return false;
        }

        setStartTime(newStart);
        setEndTime(newEnd);

        void timerStorage.setStartTime(newStart);
        void timerStorage.setEndTime(newEnd);

        console.log("SAVE", newStart, newEnd);
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