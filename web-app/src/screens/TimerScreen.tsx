import { useState } from 'react';
import { useTimerContext } from '../context/TimerContext';
import { useTimer } from '../hooks/useTimer';
import { AnalogClock } from '../components/AnalogClock';
import { Header } from '../components/Header';
import { TimerSetting } from '../components/TimerSetting';
import { TimerSettingDialog } from '../components/TimerSettingDialog'; // 다이얼로그 가져오기

export const TimerScreen = () => {
    const { clockMode, setClockMode } = useTimerContext();
    const { startTime, setStartTime, endTime, setEndTime, timerRunning, renderingTime, start, stop } = useTimer(clockMode);

    // 다이얼로그 오픈 여부 상태
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                            onClickSetting={() => setIsDialogOpen(true)} // 세팅 버튼 클릭 시 팝업 활성화
                        />
                    </div>
                )}
            </main>

            {/* 다이얼로그 상단 배치 */}
            <TimerSettingDialog
                isOpen={isDialogOpen}
                initialStartTime={startTime}
                initialEndTime={endTime}
                onClose={() => setIsDialogOpen(false)}
                onSave={(newStart, newEnd) => {
                    setStartTime(newStart);
                    setEndTime(newEnd);
                }}
            />
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
        width: '90%',
        maxWidth: '1000px',
    },
};