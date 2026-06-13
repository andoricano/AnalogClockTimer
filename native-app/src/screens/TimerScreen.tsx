import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTimer } from '../hooks/useTimer';
import { AnalogClock } from '../components/AnalogClock';
import { testStorage, defaultExamData } from '../utils/storage/testStorage';
import { ScheduleController } from '../components/schedule/ScheduleController';
import { TimelineSelectDialog } from '../components/modals/TimelineSelectDialog';

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

    const [isSettingVisible, setIsSettingVisible] = useState(true);
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    // 1. 네비게이션 기본 옵션 설정 (헤더를 투명하게 만들고 절대 좌표처럼 띄움)
    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerBlurEffect: 'none',
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerShadowVisible: false,
        });
    }, [navigation]);

    const handleStart = () => {
        setIsSettingVisible(false);
        start();
    };

    const handleStop = () => {
        setIsSettingVisible(true);
        stop();
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: isSettingVisible
        });
    }, [navigation, isSettingVisible]);

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

    useEffect(() => {
        if (timerStatus === 'FINISHED' || timerStatus === 'READY') {
            setIsSettingVisible(true);
        }
    }, [timerStatus]);

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
                        currentIndex={currentIndex}
                        timelineLength={timeline.length}
                        onClickStart={handleStart}
                        onClickStop={handleStop}
                        onClickRefresh={setRenderStartTime}
                        onClickScheduleList={() => setIsListModalOpen(true)}
                        onClickChange={(targetIndex) => {
                            if (targetIndex >= 0 && targetIndex < timeline.length) {
                                initScheduleTimeline(timeline, targetIndex);
                            } else {
                                initScheduleTimeline(timeline, 0);
                            }
                        }}
                    />
                </View>



            </View>

            <TimelineSelectDialog
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                timeline={timeline}
                currentIndex={currentIndex}
                onClickChange={(targetIndex) => {
                    if (targetIndex >= 0 && targetIndex < timeline.length) {
                        initScheduleTimeline(timeline, targetIndex);
                    } else {
                        initScheduleTimeline(timeline, 0);
                    }
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