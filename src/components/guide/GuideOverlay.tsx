import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TIMER_GUIDES } from './TimerGuidComponents';

interface GuideOverlayProps {
    onClose: () => Promise<void>;
}

export const GuideOverlay: React.FC<GuideOverlayProps> = ({ onClose }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleNext = async () => {
        if (currentIndex < TIMER_GUIDES.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            await onClose();
        }
    };

    const currentGuide = TIMER_GUIDES[currentIndex];

    return (
        <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={handleNext}
        >
            <View style={styles.contentContainer}>
                {currentGuide.renderContent()}
            </View>

            <Text style={styles.tipText}>
                화면을 터치하면 다음으로 넘어갑니다 ({currentIndex + 1} / {TIMER_GUIDES.length})
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: '80%',
        alignItems: 'center',
    },
    tipText: {
        position: 'absolute',
        bottom: 60,
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
});