import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { testStorage } from '../utils/storage/testStorage';
import { Ionicons } from '@expo/vector-icons';
import { ExamTimerItem } from '../components/schedule/TestScheduleItemRow';
import { TestScheduleList } from '../components/schedule/TestScheduleList';

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [examList, setExamList] = useState<ExamTimerItem[]>([]);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const loadData = async () => {
        const list = await testStorage.getExamList();
        setExamList(list as ExamTimerItem[]);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation]);

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
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setIsEditMode(!isEditMode)}
                    style={styles.headerRightButton}
                >
                    <Text style={[styles.headerRightButtonText, isEditMode && styles.activeEditText]}>
                        {isEditMode ? '완료' : '편집'}
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, isEditMode]);

    const handlePressItem = (item: ExamTimerItem) => {
        navigation.navigate('SetTimer', { id: item.id, add: false });
    };

    const handleUpdateOrder = async (nextList: ExamTimerItem[]) => {
        setExamList(nextList);
        await testStorage.setExamList(nextList);
    };

    const handleDeleteItem = async (id: string) => {
        await testStorage.deleteExam(id);
        await loadData();
    };

    return (
        <View style={styles.container}>
            <TestScheduleList
                data={examList} 
                onPressItem={handlePressItem}
                isEditMode={isEditMode}
                onUpdateOrder={handleUpdateOrder}
                onDeleteItem={handleDeleteItem}
            />

            {!isEditMode && (
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SetTimer', { add: true })}>
                        <Text style={styles.buttonText}>타이머 추가하기</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    headerLeftButton: {
        marginLeft: 16,
    },
    headerRightButton: {
        marginRight: 16,
    },
    headerRightButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    activeEditText: {
        color: '#34C759',
    },
});