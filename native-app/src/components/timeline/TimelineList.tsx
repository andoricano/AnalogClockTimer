import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { TimerSetMode } from '../../types/navigation';
import { TimelineItemRow, DraggedTimelineItem, TimelineSetItem } from './TimelineItemRow';

interface ListProps {
    mode: TimerSetMode;
    data: TimelineSetItem[];
    setData: (data: TimelineSetItem[]) => void;
    onRemove: (index: number) => void;
}

export const TimelineList = ({
    mode,
    data,
    setData,
    onRemove,
}: ListProps) => {
    const wrappedData = useMemo<DraggedTimelineItem[]>(() => {
        return data.map((item, index) => ({
            ...item,
            id: `${item.subject}-${item.startTime}-${index}`,
        }));
    }, [data]);

    const handleDragEnd = (nextDraggedData: DraggedTimelineItem[]) => {
        const unwrappedData: TimelineSetItem[] =
            nextDraggedData.map(({ id, ...pureItem }) => pureItem);

        setData(unwrappedData);
    };

    return (
        <DraggableFlatList
            data={wrappedData}
            extraData={data}
            onDragEnd={({ data: nextData }) =>
                handleDragEnd(nextData ?? [])
            }
            keyExtractor={(item) => item.id}
            renderItem={(params) => (
                <TimelineItemRow
                    {...params}
                    mode={mode}
                    onDelete={onRemove}
                />
            )}
            containerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});