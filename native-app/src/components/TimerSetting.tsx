import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

interface TimerSettingProps {
    startTime: string;
    endTime: string;
    isRunning: boolean;
    onClickStart: () => void;
    onClickStop: () => void;
    onClickSetting?: () => void;
}

export const TimerSetting: React.FC<TimerSettingProps> = ({
    startTime,
    endTime,
    isRunning,
    onClickStart,
    onClickStop,
    onClickSetting,
}) => {
    return (
        <View style={styles.settingBox}>
            <View style={styles.infoArea}>
                <View style={styles.item}>
                    <Text style={styles.label}>시작 시간:</Text>
                    <Text style={styles.value}>{startTime}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.item}>
                    <Text style={styles.label}>종료 시간:</Text>
                    <Text style={styles.value}>{endTime}</Text>
                </View>
            </View>

            <View style={styles.buttonArea}>
                {!isRunning && (
                    <Pressable
                        onPress={onClickSetting}
                        style={styles.settingButton}
                    >
                        <Text style={styles.settingButtonText}>
                            Setting
                        </Text>
                    </Pressable>
                )}

                <Pressable
                    onPress={isRunning ? onClickStop : onClickStart}
                    style={[
                        styles.actionButton,
                        isRunning
                            ? styles.stopButton
                            : styles.startButton,
                    ]}
                >
                    <Text style={styles.actionButtonText}>
                        {isRunning ? 'Stop' : 'Start'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        width: '100%',
        height: 60,

        backgroundColor: '#ffffff',

        borderWidth: 1,
        borderColor: '#e5e5ea',
        borderRadius: 12,

        paddingHorizontal: 16,
    },

    infoArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
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

    divider: {
        width: 1,
        height: 16,
        backgroundColor: '#e5e5ea',
        marginHorizontal: 16,
    },

    buttonArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    actionButton: {
        width: 80,
        height: 36,

        borderRadius: 6,

        justifyContent: 'center',
        alignItems: 'center',
    },

    startButton: {
        backgroundColor: '#007aff',
    },

    stopButton: {
        backgroundColor: '#ff3b30',
    },

    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    settingButton: {
        width: 80,
        height: 36,

        borderRadius: 6,

        backgroundColor: '#e5e5ea',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 8,
    },

    settingButtonText: {
        color: '#555559',
        fontSize: 14,
        fontWeight: 'bold',
    },
});