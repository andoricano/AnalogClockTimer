import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalogClock } from '../components/AnalogClock';
import { useTimerContext } from '../context/TimerContext';
import { GuideOverlay } from '../components/guide/GuideOverlay';

interface ClockScreenProps {
    navigation: any;
}

export const ClockScreen: React.FC<ClockScreenProps> = ({ navigation }) => {
    const { showTutorial, closeTutorial } = useTimerContext();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.setOptions({ headerShown: false })}
                    style={styles.headerRightButton}
                >
                    <Ionicons name="expand-outline" size={24} color="#333" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const getFinalAngles = () => {
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        const s = currentTime.getSeconds();

        return {
            hours: (h % 12) * 30 + m * 0.5,
            minutes: m * 6,
            seconds: s * 6,
        };
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.mainContent}
                activeOpacity={1}
                onPress={() => navigation.setOptions({ headerShown: true })}
            >
                <AnalogClock angles={getFinalAngles()} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    headerRightButton: {
        marginRight: 16,
    },
});