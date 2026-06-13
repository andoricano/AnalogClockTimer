import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { testStorage, defaultExamData } from '../utils/storage/testStorage';
import { ExamTimerItem } from '../components/schedule/TestScheduleItemRow';
import { TestScheduleList } from '../components/schedule/TestScheduleList';
import { useTimerContext } from '../context/TimerContext'; // 💡 훅 이름 매칭 확인

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [examList, setExamList] = useState<ExamTimerItem[] | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { isInitialized } = useTimerContext();

    const loadData = async () => {
        if (isInitialized === null) {
            setExamList(null);
            return;
        }

        if (isInitialized === false) {
            setExamList([defaultExamData]);
            return;
        }

        const list = await testStorage.getExamList();

        if (!list || list.length === 0) {
            setExamList([]); 
        } else {
            setExamList(list as ExamTimerItem[]);
        }
    };


    useEffect(() => {
        loadData();
    }, [isInitialized]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation, isInitialized]);

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
                    onPress={() => navigation.navigate('Setting')}
                    style={styles.headerRightButton}
                >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handlePressItem = (item: ExamTimerItem) => {
        navigation.navigate('SetTimer', { mode: 'view', id: item.id });
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
            {/* 시간표 목록 타이틀 및 편집 버튼 행 */}
            <View style={styles.titleRowContainer}>
                <Text style={styles.titleText}>시간표 목록</Text>
                <TouchableOpacity
                    onPress={() => setIsEditMode(!isEditMode)}
                    style={styles.inlineEditButton}
                >
                    <Text style={[styles.inlineEditButtonText, isEditMode && styles.activeEditText]}>
                        {isEditMode ? '완료' : '편집'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <TestScheduleList
                data={examList}
                onPressItem={handlePressItem}
                isEditMode={isEditMode}
                onUpdateOrder={handleUpdateOrder}
                onDeleteItem={handleDeleteItem}
            />

            {!isEditMode && (
                <View style={styles.bottomContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('SetTimer', { mode: 'create' })}
                    >
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
    titleRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 64,
        backgroundColor: '#f5f5f5',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 20,
        marginBottom: 10,
    },
    inlineEditButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    inlineEditButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    activeEditText: {
        color: '#34C759',
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
});