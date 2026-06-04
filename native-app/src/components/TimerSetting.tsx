import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';
import { TimerStatus } from '../hooks/useTimer';
import { Ionicons } from '@expo/vector-icons';

interface TimerSettingProps {
    startTime: string;
    endTime: string;
    timerStatus: TimerStatus;
    onClickRefresh: () => void;
    onClickStart: () => void;
    onClickStop: () => void;
    onClickSetting: () => void;
}

export const TimerSetting: React.FC<TimerSettingProps> = ({
    startTime,
    endTime,
    timerStatus,
    onClickRefresh,
    onClickStart,
    onClickStop,
    onClickSetting
}) => {
    const getButtonText = () => {
        switch (timerStatus) {
            case 'RUNNING':
                return '중지하기';
            case 'PAUSED':
                return '재개하기';
            case 'FINISHED':
                return '다시하기';
            case 'READY':
            default:
                return '시작하기';
        }
    };
    const isRunning = timerStatus === 'RUNNING';
    const showRefresh = timerStatus === 'READY' || timerStatus === 'PAUSED';

    return (
        <View style={styles.settingBox}>
            <View style={styles.flexRow}>
                {/* 시간 정보 영역 (좌측) */}
                <View style={styles.infoArea}>
                    <View style={styles.item}>
                        <Text style={styles.label}>시작 시간:</Text>
                        <Text style={styles.value}>{startTime}</Text>
                    </View>
                    <View style={[styles.item, { marginBottom: 0 }]}>
                        <Text style={styles.label}>종료 시간:</Text>
                        <Text style={styles.value}>{endTime}</Text>
                    </View>
                </View>

                {/* 통합 편집 버튼 영역 (우측) */}
                <Pressable onPress={onClickSetting} style={styles.editButton}>
                    <Ionicons name="create-outline" size={22} color="#007aff" />
                </Pressable>
            </View>

            <View style={styles.buttonArea}>

                {showRefresh && (
                    <Pressable
                        onPress={onClickRefresh}
                        style={styles.refreshButton}
                    >
                        <Text style={styles.refreshButtonText}>
                            시계 초기화
                        </Text>
                    </Pressable>
                )}

                <Pressable
                    onPress={isRunning ? onClickStop : onClickStart}
                    style={[
                        styles.actionButton,
                        isRunning ? styles.stopButton : styles.startButton,
                    ]}
                >
                    <Text style={styles.actionButtonText}>
                        {getButtonText()}
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
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    editButton: {
        padding: 12,
        backgroundColor: '#f2f2f7',
        borderRadius: 8,
    },

    label: {
        fontSize: 14,
        color: '#666',
        marginRight: 6,
    },

    value: {
        fontSize: 14,
        color: '#1c1c1e',
        fontFamily: 'monospace',
        fontWeight: '600',
    },

    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },

    actionButton: {
        flex: 1,
        height: 40,

        borderRadius: 6,

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
        fontSize: 14,
        fontWeight: 'bold',
    },

    refreshButton: {
        flex: 1,
        height: 40,

        borderRadius: 6,

        backgroundColor: '#007aff',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 8,
    },

    refreshButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});