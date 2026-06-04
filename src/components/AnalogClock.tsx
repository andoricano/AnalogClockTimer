import React from 'react';

interface AnalogClockProps {
    angles: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    bgImage?: string;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ angles, bgImage }) => {
    const dynamicClockStyle: React.CSSProperties = {
        ...styles.clockCircle,
        ...(bgImage
            ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: '#ffffff' }
        )
    };

    const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div style={dynamicClockStyle}>
            {!bgImage && numbers.map((num) => {
                const angle = num * 30;
                return (
                    <div
                        key={num}
                        style={{
                            ...styles.numberWrapper,
                            transform: `rotate(${angle}deg)`
                        }}
                    >
                        <div
                            style={{
                                ...styles.numberItem,
                                transform: `translateX(-50%) rotate(${-angle}deg)`
                            }}
                        >
                            {num}
                        </div>
                    </div>
                );
            })}

            <div style={{
                ...styles.hand,
                ...styles.hourHand,
                transform: `translateX(-50%) rotate(${angles.hours}deg)`
            }} />

            <div style={{
                ...styles.hand,
                ...styles.minuteHand,
                transform: `translateX(-50%) rotate(${angles.minutes}deg)`
            }} />

            <div style={{
                ...styles.hand,
                ...styles.secondHand,
                transform: `translateX(-50%) rotate(${angles.seconds}deg)`
            }} />

            <div style={styles.centerPin} />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    clockCircle: {
        width: '50vw',
        height: '50vw',
        maxWidth: '600px',
        maxHeight: '600px',
        borderRadius: '50%',
        border: '5px solid #1c1c1e',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    numberWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
    numberItem: {
        position: 'absolute',
        top: '6%',
        left: '50%',
        fontSize: 'clamp(12px, 2.5vw, 25px)',
        fontWeight: 'bold',
        color: '#1c1c1e',
        userSelect: 'none',
    },
    hand: {
        position: 'absolute',
        bottom: '50%',
        left: '50%',
        transformOrigin: 'bottom center',
        borderRadius: '4px',
    },
    hourHand: {
        width: '2%',
        height: '25%',
        backgroundColor: '#1c1c1e',
        zIndex: 3,
    },
    minuteHand: {
        width: '1.2%',
        height: '36%',
        backgroundColor: '#48484a',
        zIndex: 2,
    },
    secondHand: {
        width: '0.5%',
        height: '43%',
        backgroundColor: '#ff3b30',
        zIndex: 1,
    },
    centerPin: {
        width: '4%',
        height: '4%',
        borderRadius: '50%',
        backgroundColor: '#1c1c1e',
        position: 'absolute',
        zIndex: 4,
    }
};