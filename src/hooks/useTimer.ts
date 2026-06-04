import { useState, useEffect } from 'react';

// HH:MM:SS 문자열을 초(seconds) 단위 숫자로 변환
const timeToSeconds = (timeStr: string): number => {
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
};

// 초(seconds) 단위 숫자를 HH:MM:SS 문자열로 변환
const secondsToTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};

export const useTimer = (clockMode: boolean) => {
    const [startTime, setStartTime] = useState<string>('00:00:00');
    const [endTime, setEndTime] = useState<string>('01:30:00');
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [renderingTime, setRenderingTime] = useState<string>('00:00:00');

    useEffect(() => {
        // 1. 시계 모드일 때: 매초 현재 실시간 반영
        if (clockMode) {
            const updateCurrentTime = () => {
                const now = new Date();
                const hrs = now.getHours().toString().padStart(2, '0');
                const mins = now.getMinutes().toString().padStart(2, '0');
                const secs = now.getSeconds().toString().padStart(2, '0');
                setRenderingTime(`${hrs}:${mins}:${secs}`);
            };

            updateCurrentTime();
            const intervalId = setInterval(updateCurrentTime, 1000);
            return () => clearInterval(intervalId);
        }

        // 2. 타이머 모드이면서 정지 상태일 때: 시작 시간으로 초기화 및 대기
        if (!timerRunning) {
            setRenderingTime(startTime);
            return;
        }

        // 3. 타이머 모드이면서 실행 상태일 때: startTime부터 endTime까지 흐름 처리
        const targetSeconds = timeToSeconds(endTime);
        let currentSeconds = timeToSeconds(renderingTime);

        // 만약 시작하려는 순간 현재 시간이 이미 종료 시간 이상이라면 작동 안 함
        if (currentSeconds >= targetSeconds) {
            setTimerRunning(false);
            return;
        }

        const tick = () => {
            currentSeconds += 1; // 1초씩 증가

            if (currentSeconds >= targetSeconds) {
                setRenderingTime(endTime);
                setTimerRunning(false); // 목표달성 시 타이머 종료
            } else {
                setRenderingTime(secondsToTime(currentSeconds));
            }
        };

        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);

    }, [clockMode, timerRunning, startTime, endTime, renderingTime]);

    // 시작할 때 무조건 기존 흐름을 리셋하고 startTime부터 재생되도록 보장
    const start = () => {
        setRenderingTime(startTime);
        setTimerRunning(true);
    };

    const stop = () => setTimerRunning(false);

    return {
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        timerRunning,
        renderingTime,
        start,
        stop
    };
};