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
import { useSetTimer } from '../hooks/useSetTimer';

interface RouteParams {
    mode: TimerSetMode;
    id?: string;
}
export const SetTimerScreen = () => {
    const route = useRoute();
    const { mode: initialMode, id } = route.params as RouteParams;
    const navigation = useNavigation<any>();
    const headerHeight = useHeaderHeight(); // 기존 선언부 복구

    const {
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
    } = useSetTimer(initialMode, id);

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isCreateMode) {
            navigation.setOptions({ headerRight: () => null });
            return;
        }

        if (isViewMode) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.headerIconButton}
                        onPress={() => setMode('edit')}
                    >
                        <Ionicons name="create-outline" size={24} color="#333" />
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
                        <Ionicons name="trash-outline" size={24} color="#333" />
                    </TouchableOpacity>
                ),
            });
        }
    }, [navigation, isCreateMode, isViewMode, isEditMode]);

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

            <View style={styles.buttonContainer}>
                {isCreateMode && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveActionButton]}
                        onPress={handleSaveToView}
                    >
                        <Text style={styles.buttonText}>저장하기</Text>
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
                        <Text style={styles.buttonText}>시작하기</Text>
                    </TouchableOpacity>
                )}

                {isEditMode && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveActionButton]}
                        onPress={handleSaveEditToView}
                    >
                        <Text style={styles.buttonText}>저장하기</Text>
                    </TouchableOpacity>
                )}
            </View>

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