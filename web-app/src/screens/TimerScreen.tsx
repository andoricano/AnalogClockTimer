import { useTimerContext } from '../context/TimerContext';
import { useTimer } from '../hooks/useTimer';
import { AnalogClock } from '../components/AnalogClock';
import { Header } from '../components/Header';
import { TimerSetting } from '../components/TimerSetting';

export const TimerScreen = () => {
    const { clockMode, setClockMode } = useTimerContext();

    const { startTime, endTime, timerRunning, renderingTime, start, stop } = useTimer(clockMode);

    const getFinalAngles = () => {
        const [h, m, s] = renderingTime.split(':').map(Number);
        return {
            hours: (h % 12) * 30 + m * 0.5,
            minutes: m * 6,
            seconds: s * 6,
        };
    };

    return (
        <div style={styles.container}>
            <Header clockMode={clockMode} setClockMode={setClockMode} />

            <main style={styles.mainContent}>
                <AnalogClock angles={getFinalAngles()} />

                {!clockMode && (
                    <div style={styles.bottomArea}>
                        <TimerSetting
                            startTime={startTime}
                            endTime={endTime}
                            isRunning={timerRunning}
                            onClickStart={start}
                            onClickStop={stop}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'sans-serif',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 40px 20px',
        boxSizing: 'border-box',
        gap: '30px',
        width: '100%',
    },
    bottomArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '80%',
        maxWidth: '1000px',
    },
};