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
    onClickRefresh: () => void;
    onClickStart: () => void;
    onClickStop: () => void;
    onClickSetting: () => void;
}

export const ScheduleController: React.FC<ScheduleControllerProps> = ({
    subject,
    startTime,
    endTime,
    timerStatus,
    onClickRefresh,
    onClickStart,
    onClickStop,
    onClickSetting
}) => {
    const actionConfig = {
        START: { text: '시작하기', onPress: onClickStart, style: styles.startButton },
        STOP: { text: '중지하기', onPress: onClickStop, style: styles.stopButton },
        RESUME: { text: '이어하기', onPress: onClickStart, style: styles.startButton },
        RESTART: { text: '다시하기', onPress: onClickStart, style: styles.startButton },
        RESET: { text: '새로하기', onPress: onClickRefresh, style: styles.refreshButton },
    };

    const leftButtonConfig: Record<TimerStatus, { visible: boolean; action?: typeof actionConfig[keyof typeof actionConfig] }> = {
        READY: { visible: false },
        RUNNING: { visible: false },
        PAUSED: { visible: true, action: actionConfig.RESET },
        FINISHED: { visible: true, action: actionConfig.RESET },
    };

    const rightButtonConfig: Record<TimerStatus, typeof actionConfig[keyof typeof actionConfig]> = {
        READY: actionConfig.START,
        RUNNING: actionConfig.STOP,
        PAUSED: actionConfig.RESUME,
        FINISHED: actionConfig.RESTART,
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

                <Pressable onPress={onClickSetting} style={styles.editButton}>
                    <Ionicons name="time-outline" size={22} color="#007aff" />
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
    editButton: {
        padding: 12,
        backgroundColor: '#efffc1',
        borderRadius: 8,
        marginLeft: 12,
    },
    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
    actionButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    refreshButton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#007aff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
});