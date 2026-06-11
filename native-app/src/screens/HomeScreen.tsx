import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { testStorage } from '../utils/storage/testStorage';
import { ExamTimerItem, TestScheduleList } from '../components/TestScheduleList';

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [examList, setExamList] = useState<ExamTimerItem[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const list = await testStorage.getExamList();
            setExamList(list as ExamTimerItem[]);
        };
        
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation]);

    // 리스트 아이템 클릭 시 핸들러
    const handlePressItem = (item: ExamTimerItem) => {
        // 타이머 작동 스크린으로 보내거나 모달을 띄우는 등 비즈니스 로직을 부모가 제어합니다.
        console.log("선택된 타이머:", item.title);
        navigation.navigate('SetTimer', { id: item.id, add: false });
    };

    return (
        <View style={styles.container}>
            {/* 상단 */}
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Clock')}>
                    <Text style={styles.buttonText}>현재 시간 아날로그 시계</Text>
                </TouchableOpacity>
            </View>

            {/* 중간 리스트 영역 (독립 컴포넌트 주입) */}
            <TestScheduleList
                data={examList} 
                onPressItem={handlePressItem} 
            />

            {/* 하단 */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SetTimer', { add: true })}>
                    <Text style={styles.buttonText}>타이머 추가하기</Text>
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
        paddingTop: 16,
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});