import { AnalogClock } from "../components/AnalogClock";
import { useTimer } from "../hooks/useTimer";

export const TimerScreen = () => {
    const { isRunning, start, stop, reset, angles } = useTimer(5);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Analog Timer</h1>

            {/* 아날로그 시계 UI */}
            <AnalogClock angles={angles} />

            {/* 제어 버튼부 */}
            <div style={styles.buttonContainer}>
                {!isRunning ? (
                    <button type="button" onClick={start} style={styles.button}>Start</button>
                ) : (
                    <button type="button" onClick={stop} style={styles.button}>Stop</button>
                )}
                <button type="button" onClick={reset} style={{ ...styles.button, ...styles.resetButton }}>Reset</button>
            </div>
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