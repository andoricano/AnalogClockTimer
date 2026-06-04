import { useState, useEffect } from 'react';
import { timeToSeconds, secondsToTime, formatTimeFromDate } from '../utils/timer';

export const useTimer = (clockMode: boolean) => {
    const [startTime, setStartTime] = useState<string>('09:00:00');
    const [endTime, setEndTime] = useState<string>('10:20:00');
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [renderingTime, setRenderingTime] = useState<string>('09:00:00');

    // 기존의 불필요한 첫 번째 useEffect(정지 시 startTime으로 덮어쓰던 것)를 완전히 제거했습니다.



    useEffect(() => {
        // [로그] useEffect 실행 시점의 전체 상태 파악
        // console.log('--- [useEffect 실행] ---', {
        //     clockMode,
        //     timerRunning,
        //     endTime,
        //     renderingTime,
        //     currentSeconds: timeToSeconds(renderingTime),
        //     targetSeconds: timeToSeconds(endTime)
        // });

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

        const tick = () => {
            const nextSeconds = currentSeconds + 1;

            // [로그] 매 초마다 계산되는 타임로그 상세 출력
            // console.log('⏰ [tick 계산로그]', {
            //     현재시간_문자열: renderingTime,
            //     현재시간_초: currentSeconds,
            //     다음시간_초: nextSeconds,
            //     목표시간_초: targetSeconds,
            //     남은시간_초: targetSeconds - nextSeconds
            // });

            if (nextSeconds >= targetSeconds) {
                // console.log('🚨 [종료 조건 만족!] endTime 고정 및 타이머 정지 시도', {
                //     설정할_endTime: endTime
                // });
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

    // 도중에 멈추면 timerRunning만 false가 되므로, renderingTime은 그 자리에 그대로 멈춥니다.
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