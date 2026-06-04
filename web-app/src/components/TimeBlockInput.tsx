import React, { useRef, useEffect } from 'react';

interface TimeBlockInputProps {
    value: string; // "HH:MM:SS" 형식의 문자열
    onChange: (newValue: string) => void;
}

export const TimeBlockInput: React.FC<TimeBlockInputProps> = ({ value, onChange }) => {
    // 기존 "HH:MM:SS" 데이터를 시, 분, 초 배열로 분리 (없으면 공백)
    const timeParts = value ? value.split(':') : ['00', '00', '00'];
    const hours = timeParts[0] || '';
    const minutes = timeParts[1] || '';
    const seconds = timeParts[2] || '';

    // 각 input 엘리먼트를 제어하기 위한 ref
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);

    // 내부 입력 값 변경 연동 처리 함수
    const handleInputChange = (
        field: 'h' | 'm' | 's',
        currentValue: string,
        nextRef: React.RefObject<HTMLInputElement | null>
    ) => {
        // 숫자만 입력 가능하도록 필터링
        const sanitized = currentValue.replace(/[^0-9]/g, '');

        // 두 글자까지만 허용
        const truncated = sanitized.slice(0, 2);

        let newHours = hours;
        let newMinutes = minutes;
        let newSeconds = seconds;

        if (field === 'h') newHours = truncated;
        if (field === 'm') newMinutes = truncated;
        if (field === 's') newSeconds = truncated;

        // 상위 컴포넌트로 규격화된 시간 문자열 전달
        onChange(`${newHours.padStart(2, '0')}:${newMinutes.padStart(2, '0')}:${newSeconds.padStart(2, '0')}`);

        // 글자 수가 2개 채워지면 다음 입력 칸으로 포커스 자동 이동
        if (truncated.length === 2 && nextRef.current) {
            nextRef.current.focus();
            nextRef.current.select(); // 기존 텍스트 자동 선택 처리로 덮어쓰기 편하게 유도
        }
    };

    // 지우기(Backspace) 버튼을 눌렀을 때 이전 칸으로 역이동 제어
    const handleKeyDown = (
        field: 'm' | 's',
        currentValue: string,
        prevRef: React.RefObject<HTMLInputElement | null>,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Backspace' && currentValue === '' && prevRef.current) {
            prevRef.current.focus();
        }
    };

    return (
        <div style={styles.blockContainer}>
            <input
                ref={hourRef}
                type="text"
                maxLength={2}
                placeholder="00"
                value={hours}
                onChange={(e) => handleInputChange('h', e.target.value, minuteRef)}
                style={styles.blockInput}
            />
            <span style={styles.colon}>:</span>
            <input
                ref={minuteRef}
                type="text"
                maxLength={2}
                placeholder="00"
                value={minutes}
                onChange={(e) => handleInputChange('m', e.target.value, secondRef)}
                onKeyDown={(e) => handleKeyDown('m', minutes, hourRef, e)}
                style={styles.blockInput}
            />
            <span style={styles.colon}>:</span>
            <input
                ref={secondRef}
                type="text"
                maxLength={2}
                placeholder="00"
                value={seconds}
                onChange={(e) => handleInputChange('s', e.target.value, { current: null })}
                onKeyDown={(e) => handleKeyDown('s', seconds, minuteRef, e)}
                style={styles.blockInput}
            />
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    blockContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f7',
        border: '1px solid #e5e5ea',
        borderRadius: '8px',
        padding: '0 8px',
        width: '100%',
        boxSizing: 'border-box',
    },
    blockInput: {
        flex: 1,
        width: '32px',
        height: '40px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#1c1c1e',
        textAlign: 'center',
        outline: 'none',
    },
    colon: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#8e8e93',
        padding: '0 2px',
        userSelect: 'none',
    },
};