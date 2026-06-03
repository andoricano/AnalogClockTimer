import React from 'react';

interface AnalogClockProps {
    angles: {
        minutes: number;
        seconds: number;
    };
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ angles }) => {
    return (
        <div style={styles.clockCircle}>
            {/* 분침 */}
            <div style={{
                ...styles.hand,
                ...styles.minuteHand,
                transform: `rotate(${angles.minutes}deg)`
            }} />

            {/* 초침 */}
            <div style={{
                ...styles.hand,
                ...styles.secondHand,
                transform: `rotate(${angles.seconds}deg)`
            }} />

            {/* 중앙 고정 핀 */}
            <div style={styles.centerPin} />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    clockCircle: {
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        border: '6px solid #1c1c1e',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    hand: {
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        transformOrigin: 'bottom center',
        borderRadius: '4px',
    },
    minuteHand: {
        width: '6px',
        height: '75px',
        backgroundColor: '#3a3a3c',
        marginLeft: '-3px', // 두께의 절반만큼 왼쪽으로 이동해 중앙 정렬
    },
    secondHand: {
        width: '2px',
        height: '90px',
        backgroundColor: '#ff3b30',
        marginLeft: '-1px', // 두께의 절반만큼 왼쪽으로 이동해 중앙 정렬
    },
    centerPin: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#1c1c1e',
        position: 'absolute',
    }
};