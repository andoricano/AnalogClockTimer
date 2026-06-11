import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

import { TimerProvider, useTimerContext } from "./src/context/TimerContext";
import { HomeScreen } from "./src/screens/HomeScreen";
import { SettingScreen } from "./src/screens/SettingScreen";
import { SetTimerScreen } from "./src/screens/SetTimerScreen";
import { TimerScreen } from "./src/screens/TimerScreen";
import { ClockScreen } from "./src/screens/ClockScreen";

const adUnitId = __DEV__ ? TestIds.BANNER : "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx";
const Stack = createNativeStackNavigator();

function MainLayout() {
  const { isAdReady } = useTimerContext();
  const [currentScreen, setCurrentScreen] = useState("Home");

  // TimerScreen일 때만 하단 광고 배너를 끕니다.
  const isTimerScreen = currentScreen === "Timer";

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <NavigationBar hidden={true} />

      <NavigationContainer
        onStateChange={(state) => {
          const currentRoute = state?.routes[state.index];
          if (currentRoute) {
            setCurrentScreen(currentRoute.name);
          }
        }}
      >
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "홈" }} />
          <Stack.Screen name="Setting" component={SettingScreen} options={{ title: "설정" }} />
          <Stack.Screen name="SetTimer" component={SetTimerScreen} options={{ title: "타이머 설정" }} />
          <Stack.Screen name="Timer" component={TimerScreen} options={{ title: "타이머 작동" }} />
          <Stack.Screen name="Clock" component={ClockScreen} options={{ title: "시계" }} />
        </Stack.Navigator>
      </NavigationContainer>

      {isAdReady && !isTimerScreen && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <TimerProvider>
      <MainLayout />
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  adContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 4,
    backgroundColor: "#fff",
  },
});