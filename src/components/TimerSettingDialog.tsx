import React, { useState, useEffect } from 'react';
import { minutesToTime, timeToMinutes } from '../utils/timer';

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
    onSave
}) => {
    const [startInput, setStartInput] = useState(initialStartTime);
    const [endInput, setEndInput] = useState(initialEndTime);
    const [isDurationMode, setIsDurationMode] = useState(false);
    const [durationInput, setDurationInput] = useState<string>('90');

    useEffect(() => {
        if (isOpen) {
            setStartInput(initialStartTime);
            setEndInput(initialEndTime);
        }
    }, [isOpen, initialStartTime, initialEndTime]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (isDurationMode) {
            const startMinutes = timeToMinutes(startInput);
            const calculatedEndMinutes = startMinutes + Number(durationInput);
            const calculatedEndTime = minutesToTime(calculatedEndMinutes);

            onSave(startInput, calculatedEndTime);
        } else {
            onSave(startInput, endInput);
        }
        onClose();
    };

    return (
        <div style={styles.overlay}>
            {/* 숫자 스피너 UI 제거를 위한 글로벌 스타일 삽입 */}
            <style>{hideSpinnerStyle}</style>

            <div style={styles.dialogBox}>
                <div style={styles.header}>
                    <h3 style={styles.title}>타이머 시간 설정</h3>
                    <label style={styles.toggleContainer}>
                        <input
                            type="checkbox"
                            checked={isDurationMode}
                            onChange={(e) => setIsDurationMode(e.target.checked)}
                            style={styles.toggleCheckbox}
                        />
                        <span style={styles.toggleLabel}>운영시간 설정</span>
                    </label>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>시작 시간</label>
                    <input
                        type="text"
                        placeholder="00:00:00"
                        value={startInput}
                        onChange={(e) => setStartInput(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {!isDurationMode ? (
                    <div style={styles.formGroup}>
                        <label style={styles.label}>종료 시간</label>
                        <input
                            type="text"
                            placeholder="00:00:00"
                            value={endInput}
                            onChange={(e) => setEndInput(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                ) : (
                    <div style={styles.formGroup}>
                        <label style={styles.label}>운영 시간 (분)</label>
                        <input
                            type="number"
                            placeholder="90"
                            value={durationInput}
                            onChange={(e) => setDurationInput(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                )}

                <div style={styles.buttonArea}>
                    <button type="button" onClick={onClose} style={styles.cancelButton}>
                        취소
                    </button>
                    <button type="button" onClick={handleSave} style={styles.saveButton}>
                        적용
                    </button>
                </div>
            </div>
        </div>
    );
};

// 브라우저 자체의 숫자 증감 스피너 화살표를 강제로 지우는 CSS 문자열
const hideSpinnerStyle = `
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type=number] {
        -moz-appearance: textfield;
    }
`;

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    dialogBox: {
        width: '360px',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '24px',
        boxSizing: 'border-box',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e5ea',
        paddingBottom: '12px',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1c1c1e',
    },
    toggleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
    },
    toggleCheckbox: {
        cursor: 'pointer',
        margin: 0,
    },
    toggleLabel: {
        fontSize: '12px',
        color: '#007aff',
        fontWeight: 'bold',
        userSelect: 'none',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        alignItems: 'flex-start',
    },
    label: {
        fontSize: '13px',
        color: '#8e8e93',
        fontWeight: '600',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        height: '40px',
        padding: '0 12px',
        borderRadius: '8px',
        border: '1px solid #e5e5ea',
        fontSize: '16px',
        fontFamily: 'monospace',
        backgroundColor: '#f2f2f7',
        color: '#1c1c1e',
        outline: 'none',
        boxSizing: 'border-box',
        textAlign: 'left',
    },
    buttonArea: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        marginTop: '8px',
    },
    cancelButton: {
        flex: 1,
        height: '44px',
        backgroundColor: '#e5e5ea',
        color: '#1c1c1e',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    saveButton: {
        flex: 1,
        height: '44px',
        backgroundColor: '#007aff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};