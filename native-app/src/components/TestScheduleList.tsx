import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    StyleProp,
    ViewStyle,
} from 'react-native';

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

interface TestScheduleListProps {
    data: ExamTimerItem[];
    onPressItem?: (item: ExamTimerItem) => void;
    containerStyle?: StyleProp<ViewStyle>;
    placeholderText?: string;
}

// 시간 변환용 로컬 헬퍼 함수 (독립성 보장)
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
            end += 1440; // 24시간 익일 예외 처리
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
export const TestScheduleList: React.FC<TestScheduleListProps> = ({
    data,
    onPressItem,
    containerStyle,
    placeholderText = "저장된 타이머가 없습니다.",
}) => {
    
    const renderItem = ({ item }: { item: ExamTimerItem }) => {
        const totalDurationText = calculateTotalDuration(item.timeline);

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => onPressItem?.(item)}
                activeOpacity={0.7}
            >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDuration}>총 시험 시간: {totalDurationText}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* 상단 작은 타이틀 영역 */}
            <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>시간표 목록</Text>
            </View>

            {data.length === 0 ? (
                <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>{placeholderText}</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
    },
});