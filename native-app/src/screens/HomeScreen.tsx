import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* 상단 시계 스크린 영역 */}
            <View style={styles.topContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Clock')}
                >
                    <Text style={styles.addButtonText}>현재 시간 아날로그 시계</Text>
                </TouchableOpacity>
            </View>

            {/* 중간 리스트 영역 (현재는 여백 처리) */}
            <View style={styles.listContainer}>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('SetTimer', { add: false })}

                >
                    <Text style={styles.addButtonText}>현재 시간 아날로그 시계</Text>
                </TouchableOpacity>
            </View>

            {/* 하단 추가하기 버튼 영역 */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('SetTimer', { add: true })}
                >
                    <Text style={styles.addButtonText}>타이머 추가하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topContainer: {
        paddingHorizontal: 20,
        paddingTop: 16, // 기본 헤더 바로 밑에 너무 붙지 않도록 상단 패딩 추가
    },
    listContainer: {
        flex: 1, // 상단과 하단 사이의 남은 모든 공간을 차지함
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20, // 하단 배너 광고 공간과의 간격 확보
    },
    addButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});