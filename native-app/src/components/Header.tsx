import React from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
} from 'react-native';

interface HeaderProps {
    clockMode: boolean;
    setClockMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
    clockMode,
    setClockMode,
}) => {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/analog_clock_icon.png')}
                    style={styles.logoImage}
                />

                <Text style={styles.logoText}>
                    Analog Clock Timer
                </Text>
            </View>

            <Pressable
                onPress={() => setClockMode(prev => !prev)}
                style={styles.modeButton}
            >
                <Text style={styles.modeButtonText}>
                    {clockMode
                        ? 'Switch to Timer'
                        : 'Switch to Clock'}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        paddingHorizontal: 20,
        backgroundColor: '#ffffff',

        borderBottomWidth: 1,
        borderBottomColor: '#e5e5ea',
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    logoImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },

    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },

    modeButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,

        borderWidth: 1,
        borderColor: '#007aff',
        borderRadius: 6,

        backgroundColor: 'transparent',
    },

    modeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007aff',
    },
});