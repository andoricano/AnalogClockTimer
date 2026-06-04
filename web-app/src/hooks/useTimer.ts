import { useState, useEffect } from 'react';
import { timeToSeconds, secondsToTime, formatTimeFromDate } from '../utils/timer';


export const useTimer = (clockMode: boolean) => {
    const [startTime, setStartTime] = useState<string>('09:00:00');
    const [endTime, setEndTime] = useState<string>('10:20:00');
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [renderingTime, setRenderingTime] = useState<string>('09:00:00');

    // 기존의 불필요한 첫 번째 useEffect(정지 시 startTime으로 덮어쓰던 것)를 완전히 제거했습니다.



    useEffect(() => {
        if (clockMode) {
            const updateCurrentTime = () => {
                setRenderingTime(formatTimeFromDate(new Date()));
            };
            updateCurrentTime();
            const intervalId = setInterval(updateCurrentTime, 1000);
            return () => clearInterval(intervalId);
        }

        if (!timerRunning) {
            // console.log('👉 [상태: 정지] timerRunning이 false이므로 대기합니다.');
            return;
        }

        const targetSeconds = timeToSeconds(endTime);
        let currentSeconds = timeToSeconds(renderingTime);
        let effectiveTargetSeconds = targetSeconds;
        if (effectiveTargetSeconds < timeToSeconds(startTime)) {
            effectiveTargetSeconds += 86400;
        }

        const tick = () => {
            const nextSeconds = currentSeconds + 1;

            if (nextSeconds >= effectiveTargetSeconds) {
                setRenderingTime(endTime);
                setTimerRunning(false);
            } else {
                currentSeconds = nextSeconds;
                setRenderingTime(secondsToTime(nextSeconds));
            }
        };

        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);

    }, [clockMode, timerRunning, endTime, renderingTime]);



    // 시작을 누를 때만 시작 시간에서 출발하도록 설정
    const start = () => {
        setRenderingTime(startTime);
        setTimerRunning(true);
    };

    const stop = () => setTimerRunning(false);

    const setRenderStartTime = () => {
        setRenderingTime(startTime);
    };







    const setTimeRange = (newStart: string, newEnd: string): boolean => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

        // 형식 체크 로그
        if (!timeRegex.test(newStart) || !timeRegex.test(newEnd)) {
            console.log('🚨 [setTimeRange] 형식 오류:', { newStart, newEnd });
            return false;
        }


        setStartTime(newStart);
        setEndTime(newEnd);

        return true;
    };



    return {
        startTime,
        endTime,
        setTimeRange,
        timerRunning,
        renderingTime,
        setRenderStartTime,
        start,
        stop
    };
};