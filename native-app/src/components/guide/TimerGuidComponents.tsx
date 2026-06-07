import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const GuideText = () => (
    <View style={styles.card}>
        <Text style={styles.title}>1단계: 타이머 안내</Text>
        <Text style={styles.body}>시계를 터치하면 반응합니다.</Text>
    </View>
);

export const GuideImage = () => (
    <View style={styles.card}>
        <Text style={styles.title}>2단계: 설정 안내</Text>
        <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>[가이드 이미지 영역]</Text>
        </View>
    </View>
);

export const GuideTextImage = () => (
    <View style={styles.card}>
        <Text style={styles.title}>3단계: 복합 가이드</Text>
        <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>[가이드 이미지 영역]</Text>
        </View>
        <Text style={styles.body}>하단 버튼을 눌러 시작하세요.</Text>
    </View>
);

export interface GuideStep {
    step: number;
    renderContent: () => React.ReactNode;
}

export const TIMER_GUIDES: GuideStep[] = [
    { step: 1, renderContent: () => <GuideText /> },
    { step: 2, renderContent: () => <GuideImage /> },
    { step: 3, renderContent: () => <GuideTextImage /> },
];

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    body: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    imagePlaceholder: {
        width: 200,
        height: 120,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 12,
    },
    imageText: {
        color: '#777',
        fontSize: 12,
    },
});