import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';

import { minutesToTime, timeToMinutes } from '../utils/timer';
import { TimeBlockInput } from './TimeBlockInput';

interface TimerSettingDialogProps {
    isOpen: boolean;
    initialStartTime: string;
    initialEndTime: string;
    onClose: () => void;
    onSave: (startTime: string, endTime: string) => void;
}

export const TimerSettingDialog: React.FC<TimerSettingDialogProps> = ({
    isOpen,
    initialStartTime,
    initialEndTime,
    onClose,
    onSave,
}) => {
    const [startInput, setStartInput] = useState(initialStartTime);
    const [endInput, setEndInput] = useState(initialEndTime);
    const [isDurationMode, setIsDurationMode] = useState(false);
    const [durationInput, setDurationInput] = useState('90');

    useEffect(() => {
        if (isOpen) {
            setStartInput(initialStartTime);
            setEndInput(initialEndTime);
        }
    }, [isOpen, initialStartTime, initialEndTime]);

    const handleSave = () => {
        if (isDurationMode) {
            const startMinutes = timeToMinutes(startInput);
            const calculatedEndMinutes =
                startMinutes + Number(durationInput);

            const calculatedEndTime =
                minutesToTime(calculatedEndMinutes);

            onSave(startInput, calculatedEndTime);
        } else {
            onSave(startInput, endInput);
        }

        onClose();
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.dialogBox}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            타이머 시간 설정
                        </Text>

                        <Pressable
                            onPress={() =>
                                setIsDurationMode((prev) => !prev)
                            }
                        >
                            <Text style={styles.toggleLabel}>
                                {isDurationMode
                                    ? '측정시간 설정 ON'
                                    : '측정시간 설정 OFF'}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>
                            시작 시간
                        </Text>

                        <TimeBlockInput
                            value={startInput}
                            onChange={setStartInput}
                        />
                    </View>

                    {!isDurationMode ? (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>
                                종료 시간
                            </Text>

                            <TimeBlockInput
                                value={endInput}
                                onChange={setEndInput}
                            />
                        </View>
                    ) : (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>
                                운영 시간 (분)
                            </Text>

                            <TextInput
                                value={durationInput}
                                onChangeText={setDurationInput}
                                keyboardType="numeric"
                                style={styles.input}
                                placeholder="90"
                            />
                        </View>
                    )}

                    <View style={styles.buttonArea}>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>
                                취소
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.saveButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>
                                적용
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',

        justifyContent: 'center',
        alignItems: 'center',
    },

    dialogBox: {
        width: 360,

        backgroundColor: '#ffffff',

        borderRadius: 14,

        padding: 24,
    },

    header: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between',

        borderBottomWidth: 1,
        borderBottomColor: '#e5e5ea',

        paddingBottom: 12,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },

    toggleLabel: {
        fontSize: 12,
        color: '#007aff',
        fontWeight: 'bold',
    },

    formGroup: {
        marginTop: 20,
    },

    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8e8e93',

        marginBottom: 6,
    },

    input: {
        height: 40,

        borderWidth: 1,
        borderColor: '#e5e5ea',

        borderRadius: 8,

        paddingHorizontal: 12,

        backgroundColor: '#f2f2f7',

        fontSize: 16,
    },

    buttonArea: {
        flexDirection: 'row',

        marginTop: 24,
    },

    cancelButton: {
        flex: 1,

        height: 44,

        borderRadius: 8,

        backgroundColor: '#e5e5ea',

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 5,
    },

    saveButton: {
        flex: 1,

        height: 44,

        borderRadius: 8,

        backgroundColor: '#007aff',

        justifyContent: 'center',
        alignItems: 'center',

        marginLeft: 5,
    },

    cancelButtonText: {
        color: '#1c1c1e',
        fontWeight: 'bold',
        fontSize: 15,
    },

    saveButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});