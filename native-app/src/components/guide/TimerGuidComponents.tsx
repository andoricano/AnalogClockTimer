import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const GuideText = () => (
    <View style={styles.card}>
        <Text style={styles.title}>타이머 사용법</Text>
        <Text style={styles.body}>시작하기를 누르면 시계만 남으며 타이머가 시작합니다.</Text>
    </View>
);


export const GuideText1 = () => (
    <View style={styles.card}>
        <Text style={styles.title}>타이머 사용법</Text>
        <Text style={styles.body}>다시 시계를 누르면 타이머가 생깁니다.</Text>
    </View>
);


export const GuideText2 = () => (
    <View style={styles.card}>
        <Text style={styles.title}>타이머 사용법</Text>
        <Text style={styles.body}>편집 버튼을 누르면 시작 및 종료 시간을 정할 수 있습니다.</Text>
    </View>
);

// export const GuideText3 = () => (
//     <View style={styles.card}>
//         <Text style={styles.title}>설명서 다시 보기</Text>
//         <Text style={styles.body}>설명서는 우측 상단 버튼을 누르시면 다시 보실 수 있습니다.</Text>
//     </View>
// );


export interface GuideStep {
    step: number;
    renderContent: () => React.ReactNode;
}

export const TIMER_GUIDES: GuideStep[] = [
    { step: 1, renderContent: () => <GuideText /> },
    { step: 2, renderContent: () => <GuideText1 /> },
    { step: 3, renderContent: () => <GuideText2 /> },
    // { step: 4, renderContent: () => <GuideText3 /> },
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