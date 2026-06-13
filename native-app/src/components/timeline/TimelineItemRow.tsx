import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import { TimerSetMode } from '../../types/navigation';
import { formatToTimeString } from '../../utils/timer';

export interface TimelineSetItem {
    subject: string;
    startTime: string;
    endTime: string;
}

export interface DraggedTimelineItem extends TimelineSetItem {
    id: string;
}

interface RowProps extends RenderItemParams<DraggedTimelineItem> {
    mode: TimerSetMode;
    onDelete: (index: number) => void;
}

export const TimelineItemRow = ({
    item,
    drag,
    isActive,
    getIndex,
    onDelete,
    mode,
}: RowProps) => {
    const index = getIndex();
    const isEditableMode = mode === 'create' || mode === 'edit';

    const formattedStartTime = formatToTimeString(item.startTime);
    const formattedEndTime = formatToTimeString(item.endTime);


    return (
        <View
            style={[
                styles.row,
                { backgroundColor: isActive ? '#e5e5ea' : '#fff' },
            ]}
        >
            {isEditableMode && (
                <TouchableOpacity
                    onPressIn={drag}
                    style={styles.dragHandle}
                >
                    <Ionicons
                        name="menu-outline"
                        size={24}
                        color="#999"
                    />
                </TouchableOpacity>
            )}

            <View style={styles.textContainer}>
                <Text style={styles.subjectText}>
                    {item.subject}
                </Text>
                <Text style={styles.timeText}>
                    {formattedStartTime} ~ {formattedEndTime}
                </Text>
            </View>

            {isEditableMode && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        if (index !== undefined) {
                            onDelete(index);
                        }
                    }}
                >
                    <Text style={styles.deleteButtonText}>
                        삭제
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e5ea',
    },
    dragHandle: {
        paddingRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        padding: 8,
    },
    deleteButtonText: {
        color: '#ff3b30',
    },
});