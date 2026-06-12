import React from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ExamTimerItem, TestScheduleItemRow } from './TestScheduleItemRow';

interface TestScheduleListProps {
    data: ExamTimerItem[];
    onPressItem?: (item: ExamTimerItem) => void;
    containerStyle?: StyleProp<ViewStyle>;
    placeholderText?: string;
    isEditMode?: boolean;
    onUpdateOrder?: (nextList: ExamTimerItem[]) => void;
    onDeleteItem?: (id: string) => void;
}

export const TestScheduleList: React.FC<TestScheduleListProps> = ({
    data,
    onPressItem,
    containerStyle,
    placeholderText = "저장된 타이머가 없습니다.",
    isEditMode = false,
    onUpdateOrder,
    onDeleteItem,
}) => {
    return (
        <GestureHandlerRootView style={[styles.container, containerStyle]}>
            <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>시간표 목록</Text>
            </View>

            {data.length === 0 ? (
                <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>{placeholderText}</Text>
                </View>
            ) : (
                <DraggableFlatList
                    data={data}
                    extraData={isEditMode}
                    keyExtractor={(item) => item.id}
                    onDragEnd={({ data: nextData }) => onUpdateOrder?.(nextData ?? [])}
                    renderItem={({ item, drag, isActive }) => (
                        <ScaleDecorator>
                            <TestScheduleItemRow
                                item={item}
                                drag={drag}
                                isActive={isActive}
                                isEditMode={isEditMode}
                                onPressItem={onPressItem}
                                onDeleteItem={onDeleteItem}
                            />
                        </ScaleDecorator>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8e8e93',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    placeholderText: {
        fontSize: 16,
    },
});