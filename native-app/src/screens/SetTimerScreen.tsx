import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { testStorage, ExamTimer, } from '../utils/storage/testStorage';
import { TimelineList } from '../components/timeline/TimelineList';
import { TimerSettingDialog } from '../components/modals/TimerSettingDialog';
import { TimelineItem } from '../components/schedule/TestScheduleItemRow';
import { TimerSetMode } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';

interface RouteParams {
    mode: TimerSetMode;
    id?: string;
}

export const SetTimerScreen = () => {
    const route = useRoute();
    const { mode: initialMode, id } = route.params as RouteParams;
    const headerHeight = useHeaderHeight();
    const [mode, setMode] = useState<TimerSetMode>(initialMode);
    const navigation = useNavigation<any>();

    const [title, setTitle] = useState<string>('');
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [currentId, setCurrentId] = useState<string | undefined>(id);

    // 모드 판별 (View 모드일 경우 수정 불가 등으로 활용 가능)
    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';
    const isViewMode = mode === 'view';

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        const unsubscribe = navigation.addListener(
            'beforeRemove',
            (e: any) => {
                e.preventDefault();
                setMode('view');
            }
        );

        return unsubscribe;
    }, [navigation, isEditMode]);

    useEffect(() => {
        if (isCreateMode || !id) {
            return;
        }

        const loadTargetExam = async () => {
            try {
                const list = await testStorage.getExamList();

                const target = list.find(
                    exam => String(exam.id) === String(id)
                );

                if (target) {
                    setTitle(target.title);
                    setTimeline(target.timeline);
                }
            } catch (error) {
                console.error('타이머 로드 실패:', error);
            }
        };

        loadTargetExam();
    }, [id, isCreateMode]);


    useEffect(() => {
        if (isCreateMode) {
            navigation.setOptions({
                headerRight: () => null,
            });
            return;
        }

        if (isViewMode) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerIconButton}
                        onPress={() => setMode('edit')}
                    >
                        <Ionicons
                            name="create-outline"
                            size={24}
                            color="#333"
                        />
                    </TouchableOpacity>
                ),
            });
            return;
        }
        if (isEditMode) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerIconButton}
                        onPress={handleScheduleDelete}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color="#333"
                        />
                    </TouchableOpacity>
                ),
            });
        }
    }, [
        navigation,
        currentId,
        isCreateMode,
        isViewMode,
        isEditMode,
    ]);


    const saveToStorage = async (updatedTitle: string, updatedTimeline: TimelineItem[]) => {
        const finalTitle = updatedTitle.trim() === '' ? '새로운 타이머' : updatedTitle.trim();
        const finalTimeline = updatedTimeline || [];

        if (isCreateMode) {
            const newId = String(Date.now());
            const newExam: ExamTimer = {
                id: newId,
                title: finalTitle,
                timeline: finalTimeline,
            };
            await testStorage.addExam(newExam);
            return { id: newId, title: finalTitle };
        } else if (id) {
            const currentList = await testStorage.getExamList();
            const updatedList = currentList.map(exam =>
                exam.id === currentId ? { ...exam, title: finalTitle, timeline: finalTimeline } : exam
            );
            await testStorage.setExamList(updatedList);
            return { id: currentId, title: finalTitle };
        }
        return { id: currentId, title: finalTitle };
    };


    const handleScheduleDelete = () => {
        if (!currentId) return;

        Alert.alert("타이머 삭제", "정말로 이 타이머를 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    // 1. 모드를 변경하여 beforeRemove 리스너가 차단하지 않도록 설정
                    setMode('view');

                    // 2. 삭제 및 뒤로가기 진행
                    await testStorage.deleteExam(currentId);
                    navigation.goBack();
                }
            }
        ]);
    };

    const shouldAutoSave = isEditMode;

    const handleSaveEditToView = async () => {
        const targetId = await saveToStorage(title, timeline);

        if (targetId) {
            setMode('view');
        }
    };

    const handleSaveToView = async () => {
        // 1. 타임라인 벨리데이션
        if (!timeline || timeline.length === 0) {
            Alert.alert("알림", "최소 하나의 일정을 추가해주세요.");
            return;
        }

        const result = await saveToStorage(title, timeline);

        if (result && result.id) {
            setCurrentId(result.id);
            setTitle(result.title);

            setMode('view');
        }
    };

    const handleSaveTimelineItem = async (subject: string, startTime: string, endTime: string) => {
        const updatedTimeline = [...timeline, { subject, startTime, endTime }];
        setTimeline(updatedTimeline);
        if (shouldAutoSave) await saveToStorage(title, updatedTimeline);
    };

    const handleUpdateTimelineOrder = async (nextTimeline: TimelineItem[]) => {
        setTimeline(nextTimeline);
        if (shouldAutoSave) {
            await saveToStorage(title, nextTimeline);
        }
    };

    const handleRemoveTimelineRow = async (index: number) => {
        const updatedTimeline = timeline.filter((_, i) => i !== index);
        setTimeline(updatedTimeline);
        if (shouldAutoSave) await saveToStorage(title, updatedTimeline);
    };

    const handleTitleBlur = async () => {
        if (shouldAutoSave && timeline.length > 0) {
            await saveToStorage(title, timeline);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            keyboardVerticalOffset={headerHeight}
        >
            <View style={styles.top}>
                <Text style={styles.label}>타이머 제목</Text>
                <TextInput
                    style={styles.input}
                    placeholder="예: 국가직 9급 공무원 시험"
                    value={title}
                    onChangeText={setTitle}
                    onBlur={handleTitleBlur}
                    editable={!isViewMode}
                />

                <View style={styles.sectionHeader}>
                    <Text style={styles.label}>시험 시간표 설정</Text>
                    {!isViewMode && (
                        <TouchableOpacity style={styles.rowAddButton} onPress={() => setIsDialogOpen(true)}>
                            <Text style={styles.rowAddButtonText}>+ 시간 추가</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.listWrapper}>
                <TimelineList
                    mode={mode}
                    data={timeline}
                    setData={handleUpdateTimelineOrder}
                    onRemove={handleRemoveTimelineRow}
                />
            </View>

            {/* View 모드가 아닐 때만 완료/저장 버튼 노출 */}
            {
                <View style={styles.buttonContainer}>
                    {isCreateMode && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveActionButton]}
                            onPress={handleSaveToView}
                        >
                            <Text style={styles.buttonText}>
                                저장하기
                            </Text>
                        </TouchableOpacity>
                    )}

                    {isViewMode && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.startButton]}
                            onPress={() => {
                                if (currentId) {
                                    navigation.navigate('Timer', { id: currentId });
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>
                                시작하기
                            </Text>
                        </TouchableOpacity>
                    )}

                    {isEditMode && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveActionButton]}
                            onPress={handleSaveEditToView}
                        >
                            <Text style={styles.buttonText}>
                                저장하기
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            <TimerSettingDialog
                isOpen={isDialogOpen}
                initialStartTime="09:00"
                initialEndTime="10:00"
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSaveTimelineItem}
            />
        </KeyboardAvoidingView>

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
    listWrapper: {
        flex: 1,
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
    headerIconButton: {
        paddingHorizontal: 8,
    },

    saveActionButton: {
        backgroundColor: '#4aa0f1',
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
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});