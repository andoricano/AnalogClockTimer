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
    onClickScheduleList: () => void;
    onClickChange: (index: number) => void;
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

    const showLeftButton = currentLeft.visible && currentLeft.action;

    return (
        <View style={styles.settingBox}>
            <View style={styles.flexRow}>
                <View style={styles.infoArea}>
                    <Text style={styles.subjectText}>{subject || '지정된 과목 없음'}</Text>
                    <Text style={styles.timeText}>{startTime} ~ {endTime}</Text>
                </View>

                {timerStatus !== 'RUNNING' && (
                    <Pressable onPress={onClickScheduleList} style={styles.listButton}>
                        <Ionicons name="list-outline" size={22} color="#007aff" />
                    </Pressable>
                )}
            </View>

            <View style={styles.buttonArea}>
                {showLeftButton && (
                    <Pressable
                        onPress={currentLeft.action!.onPress}
                        style={[styles.actionButton, currentLeft.action!.style]}
                    >
                        <Text style={styles.actionButtonText}>
                            {currentLeft.action!.text}
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
        backgroundColor: '#e8f2ff', // 파란색 아이콘과 어울리는 연한 파란색 배경으로 변경
        borderRadius: 8,
        marginLeft: 12,
    },
    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
        gap: 8, // 버튼 사이의 여백을 마진 대신 gap으로 처리 (버튼이 혼자 남았을 때 공백 에러 방지)
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
        backgroundColor: '#6ba401',
        // marginRight 제거 (gap으로 대체)
    },
    refreshButton: {
        backgroundColor: '#007aff',
        // marginRight 제거 (gap으로 대체)
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});