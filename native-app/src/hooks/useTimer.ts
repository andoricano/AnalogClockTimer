import { useState, useEffect } from 'react';
import { timeToSeconds, secondsToTime, formatTimeFromDate } from '../utils/timer';
import { TimelineItem } from '../components/schedule/TestScheduleItemRow';

export type TimerStatus = 'READY' | 'RUNNING' | 'PAUSED' | 'FINISHED';

export const useTimer = () => {
    const [clockMode, setClockMode] = useState<boolean>(false);
    const [timerStatus, setTimerStatus] = useState<TimerStatus>('READY');
    
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const [currentSubject, setCurrentSubject] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('09:00:00');
    const [endTime, setEndTime] = useState<string>('10:20:00');
    const [renderingTime, setRenderingTime] = useState<string>('09:00:00');

    const ensureSecondsFormat = (timeStr: string): string => {
        if (!timeStr) return '00:00:00';
        return timeStr.split(':').length === 2 ? `${timeStr}:00` : timeStr;
    };

    const initScheduleTimeline = (items: TimelineItem[], startIndex: number = 0) => {
        if (!items || items.length === 0) return;

        setTimeline(items);
        setCurrentIndex(startIndex);

        const currentItem = items[startIndex];
        const formattedStart = ensureSecondsFormat(currentItem.startTime);
        const formattedEnd = ensureSecondsFormat(currentItem.endTime);

        setCurrentSubject(currentItem.subject);
        setStartTime(formattedStart);
        setEndTime(formattedEnd);
        setRenderingTime(formattedStart);
        setTimerStatus('READY');
    };

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

                if (currentIndex < timeline.length - 1) {
                    initScheduleTimeline(timeline, currentIndex + 1);
                } else {
                    setTimerStatus('FINISHED');
                }
            } else {
                setRenderingTime(secondsToTime(nextSeconds % 86400));
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [clockMode, timerStatus, startTime, endTime, renderingTime, timeline, currentIndex]);

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

    const setManualTimeRange = (newStart: string, newEnd: string): boolean => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

        if (!timeRegex.test(newStart) || !timeRegex.test(newEnd)) {
            return false;
        }

        const formattedStart = ensureSecondsFormat(newStart);
        const formattedEnd = ensureSecondsFormat(newEnd);

        setStartTime(formattedStart);
        setEndTime(formattedEnd);
        setRenderingTime(formattedStart);
        return true;
    };

    return {
        clockMode,
        setClockMode,
        timeline,
        currentIndex,
        currentSubject,
        startTime,
        endTime,
        timerStatus,
        renderingTime,
        initScheduleTimeline,
        setManualTimeRange,
        setRenderStartTime,
        start,
        stop,
    };
};