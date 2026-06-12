import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTimer } from '../hooks/useTimer';
import { AnalogClock } from '../components/AnalogClock';
import { TimerSettingDialog } from '../components/modals/TimerSettingDialog';
import { testStorage, defaultExamData } from '../utils/storage/testStorage';
import { ScheduleController } from '../components/schedule/ScheduleController';

export const TimerScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { id } = route.params || {};

    const {
        clockMode,
        startTime,
        endTime,
        timerStatus,
        renderingTime,
        currentSubject,
        timeline,
        currentIndex,
        initScheduleTimeline,
        setManualTimeRange,
        setRenderStartTime,
        start,
        stop,
    } = useTimer();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSettingVisible, setIsSettingVisible] = useState(true);

    console.log('=== [TimerScreen] 실시간 상태 디버깅 ===');
    console.log('- 파라미터 ID:', id);
    console.log('- 현재 과목 (currentSubject):', currentSubject);
    console.log('- 스케줄 위치:', `${currentIndex + 1} / ${timeline.length}`);
    console.log('- 현재 교시 범위:', `${startTime} ~ ${endTime}`);
    console.log('- 렌더링 시간 / 상태:', `${renderingTime} [${timerStatus}]`);
    console.log('======================================');

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => console.log('설정 모달 오픈 로그')}
                    style={styles.headerRightButton}
                >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const loadActiveSchedule = async () => {
            if (!id) return;

            let targetExam = null;
            if (id === 'default_csat') {
                targetExam = defaultExamData;
            } else {
                const list = await testStorage.getExamList();
                targetExam = list.find(exam => exam.id === id);
            }

            if (targetExam && targetExam.timeline.length > 0) {
                initScheduleTimeline(targetExam.timeline);
            }
        };

        loadActiveSchedule();
    }, [id]);

    useEffect(() => {
        if (!clockMode) {
            setRenderStartTime();
        }
    }, [clockMode]);

    useEffect(() => {
        if (timerStatus === 'RUNNING') {
            setIsSettingVisible(false);
        } else if (timerStatus === 'READY' || timerStatus === 'FINISHED') {
            setIsSettingVisible(true);
        }
    }, [timerStatus]);

    const handleClockPress = () => {
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
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleClockPress}
                    disabled={timerStatus !== 'RUNNING'} 
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
                    <ScheduleController
                        subject={currentSubject}
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
                    setManualTimeRange(newStart, newEnd);
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
    headerRightButton: {
        marginRight: 16,
    },
});