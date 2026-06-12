import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimerStatus } from '../../hooks/useTimer';

interface ScheduleControllerProps {
    subject?: string;
    startTime: string;
    endTime: string;
    timerStatus: TimerStatus;
    currentIndex: number;
    timelineLength: number;
    onClickStart: () => void;
    onClickStop: () => void;
    onClickRefresh: () => void;
    onClickScheduleList: () => void; // 시간표 모달 오픈용
    onClickChange: (index: number) => void; // 인덱스 직접 변경용
}

export const ScheduleController: React.FC<ScheduleControllerProps> = ({
    subject,
    startTime,
    endTime,
    timerStatus,
    currentIndex,
    timelineLength,
    onClickStart,
    onClickStop,
    onClickRefresh,
    onClickScheduleList,
    onClickChange
}) => {
    const isLastSchedule = currentIndex === timelineLength - 1;
    
    // 다음 스케줄 혹은 처음 스케줄 인덱스 계산
    const nextIndex = isLastSchedule ? 0 : currentIndex + 1;

    const actionConfig = {
        START: { text: '시작하기', onPress: onClickStart, style: styles.startButton },
        STOP: { text: '중지하기', onPress: onClickStop, style: styles.stopButton },
        NEXT: { 
            text: isLastSchedule ? '처음 시간으로' : '다음 시간', 
            onPress: () => onClickChange(nextIndex), 
            style: styles.nextButton 
        },
        RESUME: { text: '이어하기', onPress: onClickStart, style: styles.startButton },
        RESET: { text: '새로하기', onPress: onClickRefresh, style: styles.refreshButton },
    };

    const leftButtonConfig: Record<TimerStatus, { visible: boolean; action?: typeof actionConfig[keyof typeof actionConfig] }> = {
        READY: { visible: true, action: actionConfig.NEXT },
        RUNNING: { visible: false },
        PAUSED: { visible: true, action: actionConfig.RESET },
        FINISHED: { visible: true, action: actionConfig.NEXT },
    };

    const rightButtonConfig: Record<TimerStatus, typeof actionConfig[keyof typeof actionConfig]> = {
        READY: actionConfig.START,
        RUNNING: actionConfig.STOP,
        PAUSED: actionConfig.RESUME,
        FINISHED: actionConfig.START,
    };

    const currentLeft = leftButtonConfig[timerStatus];
    const currentRight = rightButtonConfig[timerStatus];

    return (
        <View style={styles.settingBox}>
            <View style={styles.flexRow}>
                <View style={styles.infoArea}>
                    <Text style={styles.subjectText}>{subject || '지정된 과목 없음'}</Text>
                    <Text style={styles.timeText}>{startTime} ~ {endTime}</Text>
                </View>

                {/* 전체 시간표 확인 버튼으로 변경 */}
                <Pressable onPress={onClickScheduleList} style={styles.listButton}>
                    <Ionicons name="list-outline" size={22} color="#007aff" />
                </Pressable>
            </View>

            <View style={styles.buttonArea}>
                {currentLeft.visible && currentLeft.action && (
                    <Pressable
                        onPress={currentLeft.action.onPress}
                        style={[styles.actionButton, currentLeft.action.style]}
                    >
                        <Text style={styles.actionButtonText}>
                            {currentLeft.action.text}
                        </Text>
                    </Pressable>
                )}

                <Pressable
                    onPress={currentRight.onPress}
                    style={[styles.actionButton, currentRight.style]}
                >
                    <Text style={styles.actionButtonText}>
                        {currentRight.text}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingBox: {
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e5ea',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    infoArea: {
        flexDirection: 'column',
        flex: 1,
    },
    subjectText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 4,
    },
    timeText: {
        fontSize: 15,
        color: '#666',
        fontFamily: 'monospace',
    },
    listButton: {
        padding: 12,
        backgroundColor: '#e1f5fe',
        borderRadius: 8,
        marginLeft: 12,
    },
    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    actionButton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#18c25c',
    },
    stopButton: {
        backgroundColor: '#ff3b30',
    },
    nextButton: {
        backgroundColor: '#8e8e93',
        marginRight: 8,
    },
    refreshButton: {
        backgroundColor: '#007aff',
        marginRight: 8,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});