import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { testStorage } from '../utils/storage/testStorage';
import { ExamTimerItem, TestScheduleList } from '../components/TestScheduleList';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 라이브러리 사용 시

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [examList, setExamList] = useState<ExamTimerItem[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Clock')}
                    style={styles.headerLeftButton}
                >
                    <Ionicons name="time-outline" size={24} color="#333" />
                </TouchableOpacity>
            ),
        });

        const loadData = async () => {
            const list = await testStorage.getExamList();
            setExamList(list as ExamTimerItem[]);
        };
        
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation]);

    const handlePressItem = (item: ExamTimerItem) => {
        console.log("선택된 타이머:", item.title);
        navigation.navigate('SetTimer', { id: item.id, add: false });
    };

    return (
        <View style={styles.container}>
            <TestScheduleList
                data={examList} 
                onPressItem={handlePressItem} 
            />

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
    // 기존 topContainer 제거
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
    headerLeftButton: {
        marginLeft: 16,
    },
});