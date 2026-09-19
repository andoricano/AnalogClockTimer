import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimeBlockInputProps {
    value: string; // "HH:MM:SS"
    onChange: (newValue: string) => void;
}

export const TimeBlockInput: React.FC<TimeBlockInputProps> = ({
    value,
    onChange,
}) => {
    // 1. 유저가 화면에서 보는 날것의 입력 문자열 상태 (처음엔 빈 값)
    const [hText, setHText] = useState('');
    const [mText, setMText] = useState('');
    const [sText, setSText] = useState('');

    // 부모 값이 외부에서 들어올 때 최초 동기화 (00 포맷을 유저가 보기 편하게 0으로 변환)
    useEffect(() => {
        if (value) {
            const parts = value.split(':');
            setHText(parts[0] ? String(Number(parts[0])) : '0');
            setMText(parts[1] ? String(Number(parts[1])) : '0');
            setSText(parts[2] ? String(Number(parts[2])) : '0');
        }
    }, [value]);

    // 위아래 증감 버튼 로직 (실시간으로 부모에게 변경 전송)
    const updateValue = (field: 'h' | 'm' | 's', amount: number) => {
        let hNum = Number(hText) || 0;
        let mNum = Number(mText) || 0;
        let sNum = Number(sText) || 0;

        if (field === 'h') hNum = (hNum + amount + 24) % 24;
        if (field === 'm') mNum = (mNum + amount + 60) % 60;
        if (field === 's') sNum = (sNum + amount + 60) % 60;

        const nextH = String(hNum);
        const nextM = String(mNum);
        const nextS = String(sNum);

        setHText(nextH);
        setMText(nextM);
        setSText(nextS);
        
        // 증감 시 부모에게 실시간 전달
        onChange(`${nextH}:${nextM}:${nextS}`);
    };

    // 2. 텍스트 직접 입력 로직 (값이 비면 부모에게는 0을 전달하되, 내 화면은 빈 칸 유지)
    const handleInputChange = (field: 'h' | 'm' | 's', text: string) => {
        const sanitized = text.replace(/[^0-9]/g, '');

        // 부모에게 전달할 값 계산 (빈 값이면 '0'으로 치환)
        const parentValue = sanitized === '' ? '0' : sanitized;

        if (field === 'h') {
            setHText(sanitized); // 💡 내 화면은 빈 칸("") 그대로 유지 (0이 부활 안 함)
            onChange(`${parentValue}:${mText || '0'}:${sText || '0'}`); // 부모에게 실시간 전달
        } else if (field === 'm') {
            setMText(sanitized);
            onChange(`${hText || '0'}:${parentValue}:${sText || '0'}`);
        } else if (field === 's') {
            setSText(sanitized);
            onChange(`${hText || '0'}:${mText || '0'}:${parentValue}`);
        }
    };

    return (
        <View style={styles.blockContainer}>
            {/* 시 (Hour) */}
            <View style={styles.unitWrapper}>
                <Pressable onPress={() => updateValue('h', 1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-up" size={16} color="#8e8e93" />
                </Pressable>
                <TextInput
                    placeholder="00"
                    placeholderTextColor="#c7c7cc"
                    value={hText}
                    onChangeText={(text) => handleInputChange('h', text)}
                    style={styles.blockInput}
                    keyboardType="number-pad"
                    maxLength={2}
                />
                <Pressable onPress={() => updateValue('h', -1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-down" size={16} color="#8e8e93" />
                </Pressable>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* 분 (Minute) */}
            <View style={styles.unitWrapper}>
                <Pressable onPress={() => updateValue('m', 1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-up" size={16} color="#8e8e93" />
                </Pressable>
                <TextInput
                    placeholder="00"
                    placeholderTextColor="#c7c7cc"
                    value={mText}
                    onChangeText={(text) => handleInputChange('m', text)}
                    style={styles.blockInput}
                    keyboardType="number-pad"
                    maxLength={2}
                />
                <Pressable onPress={() => updateValue('m', -1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-down" size={16} color="#8e8e93" />
                </Pressable>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* 초 (Second) */}
            <View style={styles.unitWrapper}>
                <Pressable onPress={() => updateValue('s', 1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-up" size={16} color="#8e8e93" />
                </Pressable>
                <TextInput
                    placeholder="00"
                    placeholderTextColor="#c7c7cc"
                    value={sText}
                    onChangeText={(text) => handleInputChange('s', text)}
                    style={styles.blockInput}
                    keyboardType="number-pad"
                    maxLength={2}
                />
                <Pressable onPress={() => updateValue('s', -1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-down" size={16} color="#8e8e93" />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    blockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f7',
        borderWidth: 1,
        borderColor: '#e5e5ea',
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 8,
        width: '100%',
    },
    unitWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockInput: {
        width: '100%',
        height: 56,
        fontSize: 20,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontWeight: 'bold',
        color: '#1c1c1e',
        textAlign: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 0,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    arrowButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    colon: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8e8e93',
        paddingHorizontal: 2,
        bottom: Platform.OS === 'ios' ? 1 : 2,
    },
});