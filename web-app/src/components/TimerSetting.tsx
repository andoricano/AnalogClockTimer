import React, { useState } from 'react';

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
    onClickSetting
}) => {
    // 인라인 스타일 호버 효과를 위한 상태 관리
    const [isHoveredSetting, setIsHoveredSetting] = useState(false);
    const [isHoveredAction, setIsHoveredAction] = useState(false);

    // 동적 배경색 처리 계산
    const getActionButtonBg = () => {
        if (isRunning) {
            return isHoveredAction ? '#d32f2f' : '#ff3b30'; // Stop 호버 시 더 어두운 레드
        }
        return isHoveredAction ? '#0056b3' : '#007aff'; // Start 호버 시 더 어두운 블루
    };

    return (
        <div style={styles.settingBox}>
            <div style={styles.infoArea}>
                <div style={styles.item}>
                    <span style={styles.label}>시작 시간:</span>
                    <strong style={styles.value}>{startTime}</strong>
                </div>
                <div style={styles.divider} />
                <div style={styles.item}>
                    <span style={styles.label}>종료 시간:</span>
                    <strong style={styles.value}>{endTime}</strong>
                </div>
            </div>

            <div style={styles.buttonArea}>
                {!isRunning && (
                    <button
                        type="button"
                        onClick={onClickSetting}
                        onMouseEnter={() => setIsHoveredSetting(true)}
                        onMouseLeave={() => setIsHoveredSetting(false)}
                        style={{
                            ...styles.settingButton,
                            backgroundColor: isHoveredSetting ? '#d1d1d6' : '#e5e5ea' // Setting 호버 시 더 어두운 그레이
                        }}
                    >
                        Setting
                    </button>
                )}

                <button
                    type="button"
                    onClick={isRunning ? onClickStop : onClickStart}
                    onMouseEnter={() => setIsHoveredAction(true)}
                    onMouseLeave={() => setIsHoveredAction(false)}
                    style={{
                        ...styles.actionButton,
                        backgroundColor: getActionButtonBg()
                    }}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    settingBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1000px',
        height: '60px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e5ea',
        borderRadius: '12px',
        padding: '0 16px',
        boxSizing: 'border-box',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    },
    infoArea: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    label: {
        fontSize: '14px',
        color: '#666',
    },
    value: {
        fontSize: '14px',
        color: '#1c1c1e',
        fontFamily: 'monospace',
    },
    divider: {
        width: '1px',
        height: '16px',
        backgroundColor: '#e5e5ea',
    },
    buttonArea: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
    },
    actionButton: {
        width: '80px',
        height: '36px',
        padding: '0',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
    },
    settingButton: {
        width: '80px',
        height: '36px',
        padding: '0',
        color: '#555559',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
    },
};