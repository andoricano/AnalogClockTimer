import { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import { useTimerContext } from '../context/TimerContext';
import { useTimer } from '../hooks/useTimer';

import { AnalogClock } from '../components/AnalogClock';
import { Header } from '../components/Header';
import { TimerSetting } from '../components/TimerSetting';
import { TimerSettingDialog } from '../components/TimerSettingDialog';

export const TimerScreen = () => {
    const { clockMode, setClockMode } = useTimerContext();

    const {
        startTime,
        endTime,
        setTimeRange,
        timerRunning,
        renderingTime,
        setRenderStartTime,
        start,
        stop,
    } = useTimer(clockMode);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!clockMode) {
            setRenderStartTime();
        }
    }, [clockMode]);

    const getFinalAngles = () => {
        const [h, m, s] = renderingTime.split(':').map(Number);

        return {
            hours: (h % 12) * 30 + m * 0.5,
            minutes: m * 6,
            seconds: s * 6,
        };
    };

    return (
        <View style={styles.container}>
            <Header
                clockMode={clockMode}
                setClockMode={setClockMode}
            />

            <View style={styles.mainContent}>
                <AnalogClock angles={getFinalAngles()} />

                {!clockMode && (
                    <View style={styles.bottomArea}>
                        <TimerSetting
                            startTime={startTime}
                            endTime={endTime}
                            isRunning={timerRunning}
                            onClickStart={start}
                            onClickStop={stop}
                            onClickSetting={() =>
                                setIsDialogOpen(true)
                            }
                        />
                    </View>
                )}
            </View>

            <TimerSettingDialog
                isOpen={isDialogOpen}
                initialStartTime={startTime}
                initialEndTime={endTime}
                onClose={() => setIsDialogOpen(false)}
                onSave={(newStart, newEnd) => {
                    setTimeRange(newStart, newEnd);
                    setRenderStartTime();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    mainContent: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },

    bottomArea: {
        width: '90%',

        alignItems: 'center',

        marginTop: 30,
    },
});