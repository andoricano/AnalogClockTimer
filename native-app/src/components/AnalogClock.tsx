import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Dimensions,
} from 'react-native';

interface AnalogClockProps {
    angles: {
        hours: number;
        minutes: number;
        seconds: number;
    };
    bgImage?: any;
}

const CLOCK_SIZE = Math.min(
    Dimensions.get('window').width * 0.8,
    350
);

export const AnalogClock: React.FC<AnalogClockProps> = ({
    angles,
    bgImage,
}) => {
    const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

    const content = (
        <>
            {!bgImage &&
                numbers.map((num) => {
                    const angle = num * 30;

                    return (
                        <View
                            key={num}
                            style={[
                                styles.numberWrapper,
                                {
                                    transform: [
                                        { rotate: `${angle}deg` },
                                    ],
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.numberItem,
                                    {
                                        transform: [
                                            { rotate: `${-angle}deg` },
                                        ],
                                    },
                                ]}
                            >
                                {num}
                            </Text>
                        </View>
                    );
                })}

            <View style={[styles.handWrapper, { transform: [{ rotate: `${angles.hours}deg` }] }]}>
                <View style={styles.hourHand} />
            </View>

            <View style={[styles.handWrapper, { transform: [{ rotate: `${angles.minutes}deg` }] }]}>
                <View style={styles.minuteHand} />
            </View>

            <View style={[styles.handWrapper, { transform: [{ rotate: `${angles.seconds}deg` }] }]}>
                <View style={styles.secondHand} />
            </View>

            <View style={styles.centerPin} />
        </>
    );

    if (bgImage) {
        return (
            <ImageBackground
                source={bgImage}
                resizeMode="cover"
                style={styles.clockCircle}
                imageStyle={styles.circleImage}
            >
                {content}
            </ImageBackground>
        );
    }

    return <View style={styles.clockCircle}>{content}</View>;
};

const styles = StyleSheet.create({
    clockCircle: {
        width: CLOCK_SIZE,
        height: CLOCK_SIZE,
        borderRadius: CLOCK_SIZE / 2,
        borderWidth: 5,
        borderColor: '#1c1c1e',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    circleImage: {
        borderRadius: CLOCK_SIZE / 2,
    },

    numberWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    numberItem: {
        marginTop: CLOCK_SIZE * 0.06,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },

    handWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },

    hourHand: {
        position: 'absolute',
        bottom: '50%',
        width: 8,
        height: CLOCK_SIZE * 0.25,
        backgroundColor: '#1c1c1e',
        borderRadius: 4,
    },

    minuteHand: {
        position: 'absolute',
        bottom: '50%',
        width: 4,
        height: CLOCK_SIZE * 0.36,
        backgroundColor: '#48484a',
        borderRadius: 4,
    },

    secondHand: {
        position: 'absolute',
        bottom: '50%',
        width: 2,
        height: CLOCK_SIZE * 0.43,
        backgroundColor: '#ff3b30',
        borderRadius: 4,
    },

    centerPin: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#1c1c1e',
    },
});