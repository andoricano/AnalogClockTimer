import { useState, useEffect } from 'react';
import { useTimerContext } from '../context/TimerContext';
import { useTimer } from '../hooks/useTimer';
import { AnalogClock } from '../components/AnalogClock';

export const TimerScreen = () => {
    const { clockMode } = useTimerContext();
    const { isRunning, start, stop, reset, angles: timerAngles } = useTimer(90); // 기본 90분(1시간 30분) 세팅
    const [currentClockAngles, setCurrentClockAngles] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!clockMode) return;

        const updateCurrentTimeAngles = () => {
            const now = new Date();
            const hours = now.getHours();
            const mins = now.getMinutes();
            const secs = now.getSeconds();

            console.log(`현재 시각 -> ${hours}시 ${mins}분 ${secs}초`);

            const secondsDegrees = secs * 6;
            const minutesDegrees = mins * 6;
            const hoursDegrees = (hours % 12) * 30 + mins * 0.5;

            setCurrentClockAngles({
                hours: hoursDegrees,
                minutes: minutesDegrees,
                seconds: secondsDegrees,
            });
        };

        updateCurrentTimeAngles();
        const intervalId = setInterval(updateCurrentTimeAngles, 1000);

        return () => clearInterval(intervalId);
    }, [clockMode]);

    const finalAngles = clockMode ? currentClockAngles : timerAngles;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                {clockMode ? 'Current Clock' : 'Analog Timer'}
            </h1>

            <AnalogClock angles={finalAngles} />

            {!clockMode && (
                <div style={styles.buttonContainer}>
                    {!isRunning ? (
                        <button type="button" onClick={start} style={styles.button}>Start</button>
                    ) : (
                        <button type="button" onClick={stop} style={styles.button}>Stop</button>
                    )}
                    <button type="button" onClick={reset} style={{ ...styles.button, ...styles.resetButton }}>Reset</button>
                </div>
            )}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'sans-serif',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    buttonContainer: {
        display: 'flex',
        gap: '10px',
        marginTop: '30px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#007aff',
        color: '#fff',
    },
    resetButton: {
        backgroundColor: '#8e8e93',
    },
};