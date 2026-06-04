import React from 'react';

interface HeaderProps {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
}



export const Header: React.FC<HeaderProps> = ({ clockMode, setClockMode }) => {
    return (
        <header style={styles.header}>
            <div style={styles.logoContainer}>
                <img
                    src="/analog_clock_icon.png"
                    alt="Logo"
                    style={styles.logoImage}
                />
                <p style={styles.logoText}>Analog Clock Timer</p>
            </div>
            <button
                type="button"
                onClick={() => setClockMode((prev) => !prev)}
                style={styles.modeButton}
            >
                {clockMode ? 'Switch to Timer' : 'Switch to Clock'}
            </button>
        </header>
    );
};

const styles: Record<string, React.CSSProperties> = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5ea',
        zIndex: 10,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    logoImage: {
        width: '24px',
        height: '24px',
        objectFit: 'contain',
    },
    logoText: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1c1c1e',
    },
    modeButton: {
        padding: '6px 12px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#007aff',
        backgroundColor: 'transparent',
        border: '1px solid #007aff',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};