import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; 

interface RouteParams {
    add?: boolean;
}

export const SetTimerScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { add } = (route.params as RouteParams) || { add: false };

    useEffect(() => {
        console.log("==========================================");
        console.log("[SetTimerScreen] 넘어온 add 인자 값:", add);
        console.log("[SetTimerScreen] 전체 route 객체:", JSON.stringify(route, null, 2));
        console.log("==========================================");
    }, [route, add]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* add가 false일 때만 임시 Start 버튼 노출 */}
                {!add && (
                    <TouchableOpacity 
                        style={styles.startButton}
                        onPress={() => navigation.navigate('Timer')}
                    >
                        <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>
                )}
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    startButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#4CD964', // 시작을 강조하는 초록색 톤
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});