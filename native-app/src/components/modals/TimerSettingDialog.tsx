import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Keyboard,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { TimeBlockInput } from '../TimeBlockInput';
import { minutesToTime, timeToMinutes } from '../../utils/timer';

interface TimerSettingDialogProps {
    isOpen: boolean;
    initialSubject?: string;
    initialStartTime: string;
    initialEndTime: string;
    onClose: () => void;
    onSave: (subject: string, startTime: string, endTime: string) => void;
}

export const TimerSettingDialog: React.FC<TimerSettingDialogProps> = ({
    isOpen,
    initialSubject = '',
    initialStartTime,
    initialEndTime,
    onClose,
    onSave,
}) => {
    const [subjectInput, setSubjectInput] = useState(initialSubject);
    const [startInput, setStartInput] = useState(initialStartTime);
    const [endInput, setEndInput] = useState(initialEndTime);
    const [isDurationMode, setIsDurationMode] = useState(false);
    const [durationInput, setDurationInput] = useState('90');

    useEffect(() => {
        if (isOpen) {
            setSubjectInput(initialSubject);
            setStartInput(initialStartTime);
            setEndInput(initialEndTime);
        }
    }, [isOpen]);

    const handleSave = () => {
        let calculatedEndTime = endInput;

        if (isDurationMode) {
            const startMinutes = timeToMinutes(startInput);
            const calculatedEndMinutes = startMinutes + Number(durationInput);
            calculatedEndTime = minutesToTime(calculatedEndMinutes);
        }

        onSave(subjectInput.trim() || '무제 과목', startInput, calculatedEndTime);
        onClose();
    };

    return (
        <Modal
            isVisible={isOpen}
            onBackdropPress={() => {
                Keyboard.dismiss();
                onClose();
            }}
            onBackButtonPress={onClose}
            avoidKeyboard={false}
            style={styles.modalCentered}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={100}
            animationOutTiming={100}
            backdropTransitionInTiming={100}
            backdropTransitionOutTiming={100}
        >
            <KeyboardAvoidingView
                behavior="padding"
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.dialogBox}>
                    <View style={styles.header}>
                        <Text style={styles.title}>과목 시간 추가</Text>
                        <Pressable onPress={() => setIsDurationMode((prev) => !prev)}>
                            <Text style={styles.toggleLabel}>
                                {isDurationMode ? '측정시간 설정 ON' : '측정시간 설정 OFF'}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>과목명</Text>
                        <TextInput
                            value={subjectInput}
                            onChangeText={setSubjectInput}
                            style={styles.input}
                            placeholder="예: 국어"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>시작 시간</Text>
                        <TimeBlockInput value={startInput} onChange={setStartInput} />
                    </View>

                    {!isDurationMode ? (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>종료 시간</Text>
                            <TimeBlockInput value={endInput} onChange={setEndInput} />
                        </View>
                    ) : (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>운영 시간 (분)</Text>
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
                        <Pressable style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>취소</Text>
                        </Pressable>
                        <Pressable style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>적용</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalCentered: {
        margin: 0,
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogBox: {
        width: '92%',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    toggleLabel: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '600',
    },
    formGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e5ea',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        fontSize: 16,
        color: '#333',
    },
    buttonArea: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#8e8e93',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});