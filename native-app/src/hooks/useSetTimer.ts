import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TimerSetMode } from '../types/navigation';
import { TimelineItem } from '../components/schedule/TestScheduleItemRow';
import { ExamTimer, testStorage } from '../utils/storage/testStorage';

export const useSetTimer = (initialMode: TimerSetMode, id?: string) => {
    const navigation = useNavigation<any>();
    const [mode, setMode] = useState<TimerSetMode>(initialMode);
    const [title, setTitle] = useState<string>('');
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [currentId, setCurrentId] = useState<string | undefined>(id);

    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';
    const isViewMode = mode === 'view';
    const shouldAutoSave = isEditMode;

    useEffect(() => {
        if (!isEditMode) return;

        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
            setMode('view');
        });

        return unsubscribe;
    }, [navigation, isEditMode]);

    useEffect(() => {
        if (isCreateMode || !id) return;

        const loadTargetExam = async () => {
            try {
                const list = await testStorage.getExamList();
                const target = list.find(exam => String(exam.id) === String(id));

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
                    setMode('view');
                    await testStorage.deleteExam(currentId);
                    navigation.goBack();
                }
            }
        ]);
    };

    const handleSaveEditToView = async () => {
        const targetId = await saveToStorage(title, timeline);
        if (targetId) {
            setMode('view');
        }
    };

    const handleSaveToView = async () => {
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

    return {
        mode,
        setMode,
        title,
        setTitle,
        timeline,
        currentId,
        isCreateMode,
        isEditMode,
        isViewMode,
        handleScheduleDelete,
        handleSaveEditToView,
        handleSaveToView,
        handleSaveTimelineItem,
        handleUpdateTimelineOrder,
        handleRemoveTimelineRow,
        handleTitleBlur,
    };
};