import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimelineItem } from '../schedule/TestScheduleItemRow';
import { formatToTimeString } from '../../utils/timer';

interface TimelineSelectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    timeline: TimelineItem[];
    currentIndex: number;
    onClickChange: (index: number) => void;
}

export const TimelineSelectDialog: React.FC<TimelineSelectDialogProps> = ({
    isOpen,
    onClose,
    timeline,
    currentIndex,
    onClickChange,
}) => {
    const [localIndex, setLocalIndex] = useState<number>(currentIndex);

    useEffect(() => {
        setLocalIndex(currentIndex);
    }, [isOpen, currentIndex]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onClickChange(localIndex);
        onClose();
    };

    const renderItem = ({ item, index }: { item: TimelineItem; index: number }) => {
        const isSelected = index === localIndex;
        const formattedStartTime = formatToTimeString(item.startTime);
        const formattedEndTime = formatToTimeString(item.endTime);

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.row,
                    isSelected && styles.selectedRow
                ]}
                onPress={() => setLocalIndex(index)}
            >
                <View style={styles.checkboxContainer}>
                    <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={22}
                        color={isSelected ? "#007aff" : "#ccc"}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.subjectText, isSelected && styles.selectedText]}>
                        {item.subject}
                    </Text>
                    <Text style={styles.timeText}>
                        {formattedStartTime} ~ {formattedEndTime}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.overlay}>
            <Pressable style={styles.pressableOverlay} onPress={onClose}>
                <Pressable style={styles.dialogBox}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>시간 선택</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={timeline}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.actionButtonGroup}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </View>
    );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    pressableOverlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogBox: {
        width: '85%',
        maxHeight: height * 0.7,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16, // 버튼 컴포넌트 여백 조절
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#e5e5ea',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },
    closeButton: {
        padding: 4,
    },
    listContainer: {
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e5ea',
        backgroundColor: '#fff',
    },
    selectedRow: {
        borderColor: '#007aff',
        backgroundColor: '#f2f8ff',
    },
    checkboxContainer: {
        paddingRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c1c1e',
    },
    selectedText: {
        color: '#007aff',
    },
    timeText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    actionButtonGroup: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#e5e5ea',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f2f2f7',
    },
    confirmButton: {
        backgroundColor: '#007aff',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#48484a',
    },
    confirmButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});