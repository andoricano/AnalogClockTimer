import React from 'react';
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
    value: string;
    onChange: (newValue: string) => void;
}

export const TimeBlockInput: React.FC<TimeBlockInputProps> = ({
    value,
    onChange,
}) => {

    const rawParts = value ? value.split(':') : [];

    const timeParts = [
        rawParts[0] ? rawParts[0].padStart(2, '0') : '00',
        rawParts[1] ? rawParts[1].padStart(2, '0') : '00',
        rawParts[2] ? rawParts[2].padStart(2, '0') : '00',
    ];

    const hours = Number(timeParts[0]) || 0;
    const minutes = Number(timeParts[1]) || 0;
    const seconds = Number(timeParts[2]) || 0;

    const updateValue = (
        field: 'h' | 'm' | 's',
        amount: number
    ) => {
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

    const handleInputChange = (
        field: 'h' | 'm' | 's',
        inputValue: string
    ) => {
        const sanitized = inputValue
            .replace(/[^0-9]/g, '')
            .slice(0, 2);

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
        <View style={styles.blockContainer}>
            {/* 시 (Hour) 블록 */}
            <View style={styles.unitWrapper}>
                <Pressable
                    onPress={() => updateValue('h', 1)}
                    style={styles.arrowButton}
                >
                    <Ionicons name="chevron-up" size={16} color="#8e8e93" />
                </Pressable>

                <TextInput
                    placeholder="00"
                    placeholderTextColor="#c7c7cc"
                    value={timeParts[0]}
                    onChangeText={(text) => handleInputChange('h', text)}
                    onBlur={() => handleBlur('h')}
                    style={styles.blockInput}
                    keyboardType="number-pad"
                    maxLength={2}
                />

                <Pressable
                    onPress={() => updateValue('h', -1)}
                    style={styles.arrowButton}
                >
                    <Ionicons name="chevron-down" size={16} color="#8e8e93" />
                </Pressable>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* 분 (Minute) 블록 */}
            <View style={styles.unitWrapper}>
                <Pressable
                    onPress={() => updateValue('m', 1)}
                    style={styles.arrowButton}
                >
                    <Ionicons name="chevron-up" size={16} color="#8e8e93" />
                </Pressable>

                <TextInput
                    placeholder="00"
                    placeholderTextColor="#c7c7cc"
                    value={timeParts[1]}
                    onChangeText={(text) => handleInputChange('m', text)}
                    onBlur={() => handleBlur('m')}
                    style={styles.blockInput}
                    keyboardType="number-pad"
                    maxLength={2}
                />

                <Pressable
                    onPress={() => updateValue('m', -1)}
                    style={styles.arrowButton}
                >
                    <Ionicons name="chevron-down" size={16} color="#8e8e93" />
                </Pressable>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* 초 (Second) 블록 */}
            <View style={styles.unitWrapper}>
                <Pressable
                    onPress={() => updateValue('s', 1)}
                    style={styles.arrowButton}
                >
                    <Ionicons name="chevron-up" size={16} color="#8e8e93" />
                </Pressable>

                <TextInput
                    placeholder="00"
                    placeholderTextColor="#c7c7cc"
                    value={timeParts[2]}
                    onChangeText={(text) => handleInputChange('s', text)}
                    onBlur={() => handleBlur('s')}
                    style={styles.blockInput}
                    keyboardType="number-pad"
                    maxLength={2}
                />

                <Pressable
                    onPress={() => updateValue('s', -1)}
                    style={styles.arrowButton}
                >
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