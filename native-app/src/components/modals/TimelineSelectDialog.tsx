import React from 'react';
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
    
    // isOpen이 false면 아무것도 연산하지 않고 즉시 화면에서 완전히 제외합니다.
    if (!isOpen) return null;

    const renderItem = ({ item, index }: { item: TimelineItem; index: number }) => {
        const isSelected = index === currentIndex;

        return (
            <TouchableOpacity
                activeOpacity={1} // 터치 시 잔상이나 흐려짐 현상도 완전 제거
                style={[
                    styles.row,
                    isSelected && styles.selectedRow
                ]}
                onPress={() => {
                    onClickChange(index); // 1. 데이터 변경
                    onClose();           // 2. 모달 즉시 닫기
                }}
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
                        {item.startTime} ~ {item.endTime}
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
                        <Text style={styles.headerTitle}>전체 시간표 확인</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // 반투명 배경 효과도 누르는 즉시 생김
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
        paddingBottom: 8,
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
});