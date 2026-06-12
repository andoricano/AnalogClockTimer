import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TimelineItemRow, DraggedTimelineItem } from './TimelineItemRow';
import { TimelineItem } from '../TestScheduleList';

interface ListProps {
    data: TimelineItem[];
    setData: (data: TimelineItem[]) => void;
    onRemove: (index: number) => void;
}

export const TimelineList = ({ data, setData, onRemove }: ListProps) => {
    const wrappedData = useMemo<DraggedTimelineItem[]>(() => {
        return data.map((item, index) => ({
            ...item,
            id: `${item.subject}-${item.startTime}-${index}`,
        }));
    }, [data]);

    const handleDragEnd = (nextDraggedData: DraggedTimelineItem[]) => {
        const unwrappedData: TimelineItem[] = nextDraggedData.map(({ id, ...pureItem }) => pureItem);
        setData(unwrappedData);
    };

    return (
        <DraggableFlatList
            data={wrappedData}
            extraData={data}
            onDragEnd={({ data: nextData }) => handleDragEnd(nextData ?? [])}
            keyExtractor={(item) => item.id}
            renderItem={(params) => (
                <TimelineItemRow {...params} onDelete={onRemove} />
            )}
            containerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});