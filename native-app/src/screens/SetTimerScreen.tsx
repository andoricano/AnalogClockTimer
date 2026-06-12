import React, { useEffect, useRef, useState } from 'react';
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
import { TimerSettingDialog } from '../components/modals/TimerSettingDialog';

interface RouteParams {
    add?: boolean;
    id?: string;
}

export const SetTimerScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { add, id } = (route.params as RouteParams) || { add: true, id: undefined };

    const [title, setTitle] = useState<string>('');
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const [activeId, setActiveId] = useState<string | undefined>(id);
    const [isAddMode, setIsAddMode] = useState<boolean>(add ?? true);


    const scrollViewRef = useRef<ScrollView>(null);

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

    const saveData = async (updatedTitle: string, updatedTimeline: TimelineItem[]) => {
        const finalTitle = updatedTitle.trim() || '새로운 타이머';

        if (isAddMode && !activeId) {
            const newId = String(Date.now());
            const newExam: ExamTimer = {
                id: newId,
                title: finalTitle,
                timeline: updatedTimeline,
            };
            await testStorage.addExam(newExam);
            setActiveId(newId);
            setIsAddMode(false);
        } else if (activeId) {
            const currentList = await testStorage.getExamList();
            const updatedList = currentList.map(exam =>
                exam.id === activeId ? { ...exam, title: finalTitle, timeline: updatedTimeline } : exam
            );
            await testStorage.setExamList(updatedList);
        }
    };

    const handleDelete = () => {
        if (!activeId) return;

        Alert.alert(
            "타이머 삭제",
            "정말로 이 타이머를 삭제하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => {
                        await testStorage.deleteExam(activeId);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (!isAddMode && activeId) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={handleDelete} style={styles.headerDeleteButton}>
                        <Text style={styles.headerDeleteButtonText}>삭제</Text>
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({
                headerRight: null,
            });
        }
    }, [navigation, isAddMode, activeId]);

    const handleSaveTimelineItem = async (subject: string, startTime: string, endTime: string) => {
        const updatedTimeline = [...timeline, { subject, startTime, endTime }];
        setTimeline(updatedTimeline);
        await saveData(title, updatedTimeline);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
    };

    const handleRemoveTimelineRow = async (index: number) => {
        const updatedTimeline = timeline.filter((_, i) => i !== index);
        setTimeline(updatedTimeline);
        await saveData(title, updatedTimeline);
    };

    const handleTitleBlur = async () => {
        if (timeline.length > 0) {
            await saveData(title, timeline);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.label}>타이머 제목</Text>
                <TextInput
                    style={styles.input}
                    placeholder="예: 국가직 9급 공무원 시험"
                    value={title}
                    onChangeText={setTitle}
                    onBlur={handleTitleBlur}
                />

                <View style={styles.sectionHeader}>
                    <Text style={styles.label}>시험 시간표 설정</Text>
                    <TouchableOpacity style={styles.rowAddButton} onPress={() => setIsDialogOpen(true)}>
                        <Text style={styles.rowAddButtonText}>+ 시간 추가</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
            >
                {timeline.map((item, index) => (
                    <View key={index} style={styles.timelineRow}>
                        <View style={styles.rowTextContainer}>
                            <Text style={styles.subjectText}>{item.subject}</Text>
                            <Text style={styles.timeText}>{item.startTime} ~ {item.endTime}</Text>
                        </View>
                        <TouchableOpacity style={styles.rowDeleteButton} onPress={() => handleRemoveTimelineRow(index)}>
                            <Text style={styles.rowDeleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {!isAddMode && activeId && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.startButton]}
                        onPress={() => navigation.navigate('Timer', { id: activeId })}
                    >
                        <Text style={styles.buttonText}>타이머 준비 완료</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TimerSettingDialog
                isOpen={isDialogOpen}
                initialStartTime="09:00"
                initialEndTime="10:00"
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSaveTimelineItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    top: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5ea',
        borderRadius: 10,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
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
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#e5e5ea',
    },
    rowTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: '40%',
    },
    timeText: {
        fontSize: 15,
        color: '#666',
    },
    rowDeleteButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    rowDeleteButtonText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        backgroundColor: '#f5f5f5',
    },
    actionButton: {
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        width: '100%',
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerDeleteButton: {
        marginRight: 16,
    },
    headerDeleteButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
});