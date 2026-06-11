import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; 
import { testStorage, ExamTimer, TimelineItem } from '../utils/storage/testStorage'; 

interface RouteParams {
    add?: boolean;
    id?: string; 
}

export const SetTimerScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { add, id } = (route.params as RouteParams) || { add: true, id: undefined };

    // --- State 관리 ---
    const [title, setTitle] = useState<string>('');
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);

    // --- 1. Read (기존 데이터 불러오기) ---
    useEffect(() => {
        if (!add && id) {
            const loadTargetExam = async () => {
                const list = await testStorage.getExamList();
                const target = list.find(exam => exam.id === id);
                if (target) {
                    setTitle(target.title);
                    setTimeline(target.timeline);
                }
            };
            loadTargetExam();
        }
    }, [add, id]);

    // --- 타임라인 동적 행 추가/삭제 핸들러 ---
    const handleAddTimelineRow = () => {
        setTimeline([...timeline, { subject: '', startTime: '09:00', endTime: '10:00' }]);
    };

    const handleRemoveTimelineRow = (index: number) => {
        setTimeline(timeline.filter((_, i) => i !== index));
    };

    const handleUpdateTimelineField = (index: number, field: keyof TimelineItem, value: string) => {
        const updated = [...timeline];
        updated[index] = { ...updated[index], [field]: value };
        setTimeline(updated);
    };

    // --- 2. Create & Update (저장 및 수정 처리) ---
    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert("알림", "타이머 제목을 입력해주세요.");
            return;
        }

        if (timeline.length === 0) {
            Alert.alert("알림", "최소 하나의 시험 시간축을 추가해주세요.");
            return;
        }

        if (add) {
            // Create 모드
            const newExam: ExamTimer = {
                id: String(Date.now()), // 고유 식별자 생성
                title: title.trim(),
                timeline,
            };
            await testStorage.addExam(newExam);
        } else if (id) {
            // Update 모드
            const currentList = await testStorage.getExamList();
            const updatedList = currentList.map(exam => 
                exam.id === id ? { ...exam, title: title.trim(), timeline } : exam
            );
            await testStorage.setExamList(updatedList);
        }

        navigation.goBack();
    };

    // --- 3. Delete (삭제 처리) ---
    const handleDelete = () => {
        if (!id) return;

        Alert.alert(
            "타이머 삭제",
            "정말로 이 타이머를 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                { 
                    text: "삭제", 
                    style: "destructive",
                    onPress: async () => {
                        await testStorage.deleteExam(id);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                {/* 대제목 입력 창 */}
                <Text style={styles.label}>타이머 대제목</Text>
                <TextInput
                    style={styles.input}
                    placeholder="예: 국가직 9급 공무원 시험"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* 세부 시간축 설정 */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.label}>시험 시간축 설정</Text>
                    <TouchableOpacity style={styles.rowAddButton} onPress={handleAddTimelineRow}>
                        <Text style={styles.rowAddButtonText}>+ 과목 추가</Text>
                    </TouchableOpacity>
                </View>

                {timeline.map((item, index) => (
                    <View key={index} style={styles.timelineRow}>
                        <TextInput
                            style={[styles.rowInput, { flex: 2 }]}
                            placeholder="과목명"
                            value={item.subject}
                            onChangeText={(val) => handleUpdateTimelineField(index, 'subject', val)}
                        />
                        <TextInput
                            style={[styles.rowInput, { flex: 1.2 }]}
                            placeholder="09:00"
                            maxLength={5}
                            value={item.startTime}
                            onChangeText={(val) => handleUpdateTimelineField(index, 'startTime', val)}
                        />
                        <Text style={styles.tilde}>~</Text>
                        <TextInput
                            style={[styles.rowInput, { flex: 1.2 }]}
                            placeholder="10:20"
                            maxLength={5}
                            value={item.endTime}
                            onChangeText={(val) => handleUpdateTimelineField(index, 'endTime', val)}
                        />
                        <TouchableOpacity style={styles.rowDeleteButton} onPress={() => handleRemoveTimelineRow(index)}>
                            <Text style={styles.rowDeleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* 하단 기능 버튼 제어 영역 */}
            <View style={styles.buttonContainer}>
                {/* 수정 모드일 때만 하단에 삭제 및 시작 분기 버튼 제공 */}
                {!add && (
                    <View style={styles.subButtonRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                            <Text style={styles.buttonText}>삭제하기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.startButton]} onPress={() => navigation.navigate('Timer', { id })}>
                            <Text style={styles.buttonText}>타이머 시작</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                {/* 저장/수정 완료 버튼 */}
                <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.buttonText}>{add ? "타이머 생성하기" : "변경사항 저장하기"}</Text>
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
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    rowAddButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    rowAddButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    rowInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        paddingHorizontal: 8,
        fontSize: 14,
        marginHorizontal: 2,
        textAlign: 'center',
    },
    tilde: {
        fontSize: 16,
        color: '#666',
        marginHorizontal: 2,
    },
    rowDeleteButton: {
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    rowDeleteButtonText: {
        color: '#FF3B30',
        fontSize: 14,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        backgroundColor: '#f5f5f5',
    },
    subButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    actionButton: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    saveButton: {
        width: '100%',
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        width: '48%',
        backgroundColor: '#FF3B30',
    },
    startButton: {
        width: '48%',
        backgroundColor: '#4CD964',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});