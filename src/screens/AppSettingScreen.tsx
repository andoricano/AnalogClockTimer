import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { testStorage } from '../utils/storage/testStorage';
import { useNavigation } from '@react-navigation/native';

export const AppSettingScreen = () => {
    const navigation = useNavigation<any>();

    const handleClearData = () => {
        Alert.alert(
            "데이터 초기화",
            "저장된 모든 타이머 데이터가 삭제됩니다. 정말 초기화하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "초기화",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await testStorage.clearExamList();

                            // 초기화 완료 후 알림을 띄우고 메인 화면 등으로 이동
                            Alert.alert("알림", "모든 데이터가 초기화되었습니다.", [
                                {
                                    text: "확인",
                                    onPress: () => navigation.goBack() // 3. 초기화 후 뒤로가기 실행
                                }
                            ]);
                        } catch (error) {
                            console.error("초기화 실패:", error);
                            Alert.alert("오류", "데이터 초기화 중 문제가 발생했습니다.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleClearData}
                    activeOpacity={0.7}
                >
                    <Text style={styles.resetButtonText}>전체 데이터 초기화</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
        marginTop: 20,
    },
    resetButton: {
        backgroundColor: '#ffffff',
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e5ea',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff3b30',
    },
});