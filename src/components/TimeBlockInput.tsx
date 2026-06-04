import React from 'react';

interface TimeBlockInputProps {
    value: string;
    onChange: (newValue: string) => void;
}

export const TimeBlockInput: React.FC<TimeBlockInputProps> = ({ value, onChange }) => {
    const rawParts = value ? value.split(':') : [];
    const timeParts = [
        rawParts[0] ?? '',
        rawParts[1] ?? '',
        rawParts[2] ?? ''
    ];

    const hours = Number(timeParts[0]) || 0;
    const minutes = Number(timeParts[1]) || 0;
    const seconds = Number(timeParts[2]) || 0;

    const updateValue = (field: 'h' | 'm' | 's', amount: number) => {
        let newH = hours;
        let newM = minutes;
        let newS = seconds;

        if (field === 'h') {
            newH = (hours + amount + 24) % 24;
        } else if (field === 'm') {
            newM = (minutes + amount + 60) % 60;
        } else if (field === 's') {
            newS = (seconds + amount + 60) % 60;
        }

        const hStr = newH.toString().padStart(2, '0');
        const mStr = newM.toString().padStart(2, '0');
        const sStr = newS.toString().padStart(2, '0');

        onChange(`${hStr}:${mStr}:${sStr}`);
    };

    const handleInputChange = (field: 'h' | 'm' | 's', inputValue: string) => {
        const sanitized = inputValue.replace(/[^0-9]/g, '').slice(0, 2);

        let hStr = timeParts[0];
        let mStr = timeParts[1];
        let sStr = timeParts[2];

        if (field === 'h') hStr = sanitized;
        if (field === 'm') mStr = sanitized;
        if (field === 's') sStr = sanitized;

        onChange(`${hStr}:${mStr}:${sStr}`);
    };

    const handleBlur = (field: 'h' | 'm' | 's') => {
        let hNum = Number(timeParts[0]) || 0;
        let mNum = Number(timeParts[1]) || 0;
        let sNum = Number(timeParts[2]) || 0;

        if (field === 'h') hNum = Math.min(hNum, 23);
        if (field === 'm') mNum = Math.min(mNum, 59);
        if (field === 's') sNum = Math.min(sNum, 59);

        const hStr = hNum.toString().padStart(2, '0');
        const mStr = mNum.toString().padStart(2, '0');
        const sStr = sNum.toString().padStart(2, '0');

        onChange(`${hStr}:${mStr}:${sStr}`);
    };

    return (
        <div style={styles.blockContainer}>
            {/* 시 (Hour) 블록 */}
            <div style={styles.unitWrapper}>
                <button type="button" onClick={() => updateValue('h', 1)} style={styles.arrowButton}>▲</button>
                <input
                    type="text"
                    placeholder="00"
                    value={timeParts[0]}
                    onChange={(e) => handleInputChange('h', e.target.value)}
                    onBlur={() => handleBlur('h')}
                    style={styles.blockInput}
                />
                <button type="button" onClick={() => updateValue('h', -1)} style={styles.arrowButton}>▼</button>
            </div>

            <span style={styles.colon}>:</span>

            {/* 분 (Minute) 블록 */}
            <div style={styles.unitWrapper}>
                <button type="button" onClick={() => updateValue('m', 1)} style={styles.arrowButton}>▲</button>
                <input
                    type="text"
                    placeholder="00"
                    value={timeParts[1]}
                    onChange={(e) => handleInputChange('m', e.target.value)}
                    onBlur={() => handleBlur('m')}
                    style={styles.blockInput}
                />
                <button type="button" onClick={() => updateValue('m', -1)} style={styles.arrowButton}>▼</button>
            </div>

            <span style={styles.colon}>:</span>

            {/* 초 (Second) 블록 */}
            <div style={styles.unitWrapper}>
                <button type="button" onClick={() => updateValue('s', 1)} style={styles.arrowButton}>▲</button>
                <input
                    type="text"
                    placeholder="00"
                    value={timeParts[2]}
                    onChange={(e) => handleInputChange('s', e.target.value)}
                    onBlur={() => handleBlur('s')}
                    style={styles.blockInput}
                />
                <button type="button" onClick={() => updateValue('s', -1)} style={styles.arrowButton}>▼</button>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    blockContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f7',
        border: '1px solid #e5e5ea',
        borderRadius: '12px',
        padding: '8px 12px',
        width: '100%',
        boxSizing: 'border-box',
    },
    unitWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    blockInput: {
        width: '100%',
        height: '32px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '18px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: '#1c1c1e',
        textAlign: 'center',
        outline: 'none',
        padding: 0,
    },
    arrowButton: {
        background: 'none',
        border: 'none',
        fontSize: '10px',
        color: '#8e8e93',
        cursor: 'pointer',
        padding: '2px 8px',
        userSelect: 'none',
    },
    colon: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#8e8e93',
        padding: '0 4px',
        marginTop: '-2px',
        userSelect: 'none',
    },
};