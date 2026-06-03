import React from 'react';

interface AnalogClockProps {
    angles: {
        hours: number;
        minutes: number;
        seconds: number;
    };
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ angles }) => {
    return (
        <div style={styles.clockCircle}>
            {/* 🌟 시침 추가 (두껍고 가장 짧음) */}
            <div style={{
                ...styles.hand,
                ...styles.hourHand,
                transform: `rotate(${angles.hours}deg)`
            }} />

            {/* 분침 (중간 두께, 중간 길이) */}
            <div style={{
                ...styles.hand,
                ...styles.minuteHand,
                transform: `rotate(${angles.minutes}deg)`
            }} />

            {/* 초침 (얇고 가장 김) */}
            <div style={{
                ...styles.hand,
                ...styles.secondHand,
                transform: `rotate(${angles.seconds}deg)`
            }} />

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
    hourHand: {
        width: '8px',
        height: '55px',
        backgroundColor: '#1c1c1e',
        marginLeft: '-4px',
        zIndex: 3,
    },
    minuteHand: {
        width: '5px',
        height: '80px',
        backgroundColor: '#48484a',
        marginLeft: '-2.5px',
        zIndex: 2,
    },
    secondHand: {
        width: '2px',
        height: '95px',
        backgroundColor: '#ff3b30',
        marginLeft: '-1px',
        zIndex: 1,
    },
    centerPin: {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#1c1c1e',
        position: 'absolute',
        zIndex: 4,
    }
};