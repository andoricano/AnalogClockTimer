import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TimelineItem {
    subject: string;
    startTime: string;
    endTime: string;
}

export interface ExamTimerItem {
    id: string;
    title: string;
    timeline: TimelineItem[];
}

interface TestScheduleItemRowProps {
    item: ExamTimerItem;
    drag: () => void;
    isActive: boolean;
    isEditMode: boolean;
    onPressItem?: (item: ExamTimerItem) => void;
    onDeleteItem?: (id: string) => void;
}

const getTimelineMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

const calculateTotalDuration = (timeline: TimelineItem[]): string => {
    let totalMinutes = 0;

    timeline.forEach(({ startTime, endTime }) => {
        let start = getTimelineMinutes(startTime);
        let end = getTimelineMinutes(endTime);

        if (end < start) {
            end += 1440;
        }
        totalMinutes += (end - start);
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
    }
    return `${totalMinutes}분`;
};

export const TestScheduleItemRow: React.FC<TestScheduleItemRowProps> = ({
    item,
    drag,
    isActive,
    isEditMode,
    onPressItem,
    onDeleteItem,
}) => {
    const totalDurationText = calculateTotalDuration(item.timeline);

    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => onPressItem?.(item)}
            activeOpacity={0.7}
            disabled={isActive || isEditMode}
        >
            <View
                style={[
                    styles.cardContainer,
                    { backgroundColor: isActive ? '#e5e5ea' : '#fff' },
                    isEditMode && styles.editCard
                ]}
            >
                <View style={styles.cardInner}>
                    {isEditMode && (
                        <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
                            <Ionicons name="menu-outline" size={24} color="#999" />
                        </TouchableOpacity>
                    )}

                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDuration}>총 시험 시간: {totalDurationText}</Text>
                    </View>

                    {isEditMode && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDeleteItem?.(item.id)}
                        >
                            <Text style={styles.deleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: 12,
    },
    cardContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    editCard: {
        borderColor: '#e5e5ea',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    dragHandle: {
        paddingRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    cardDuration: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontSize: 14,
        fontWeight: '600',
    },
});