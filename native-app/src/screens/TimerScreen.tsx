import { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { useTimer } from '../hooks/useTimer';

import { AnalogClock } from '../components/AnalogClock';
import { TimerSetting } from '../components/TimerSetting';
import { TimerSettingDialog } from '../components/TimerSettingDialog';

export const TimerScreen = () => {
    const {
        clockMode,
        startTime,
        endTime,
        setTimeRange,
        timerStatus,
        renderingTime,
        setRenderStartTime,
        start,
        stop,
    } = useTimer();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSettingVisible, setIsSettingVisible] = useState(true);


    // 1. clockMode 변경 시 처리
    useEffect(() => {
        if (!clockMode) {
            setRenderStartTime();
        }
    }, [clockMode]);

    // 2. 타이머 상태(timerStatus) 변화에 따른 UX 로직 처리
    useEffect(() => {
        if (timerStatus === 'RUNNING') {
            setIsSettingVisible(false); // RUNNING이 되면 안 보임
        } else if (timerStatus === 'READY' || timerStatus === 'FINISHED') {
            setIsSettingVisible(true);  // READY나 FINISHED가 되면 다시 나타남
        }
    }, [timerStatus]);

    // 3. 시계 클릭 시 실행될 핸들러
    const handleClockPress = () => {
        // RUNNING 상태일 때만 클릭으로 켜고 끌 수 있게 제한
        if (timerStatus === 'RUNNING') {
            setIsSettingVisible((prev) => !prev);
        }
    };

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
            <View style={styles.mainContent}>
                {/* 시계 클릭이 가능하도록 터치 영역으로 감싸기 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleClockPress}
                    disabled={timerStatus !== 'RUNNING'} // RUNNING이 아닐 때는 터치 이벤트를 막음
                >
                    <AnalogClock angles={getFinalAngles()} />
                </TouchableOpacity>

                <View
                    style={[
                        styles.bottomArea,
                        { opacity: !clockMode && isSettingVisible ? 1 : 0 }
                    ]}
                    pointerEvents={!clockMode && isSettingVisible ? 'auto' : 'none'}
                >
                    <TimerSetting
                        startTime={startTime}
                        endTime={endTime}
                        timerStatus={timerStatus}
                        onClickRefresh={setRenderStartTime}
                        onClickStart={start}
                        onClickStop={stop}
                        onClickSetting={() => setIsDialogOpen(true)}
                    />
                </View>
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