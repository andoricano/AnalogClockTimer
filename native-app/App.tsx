import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { Ionicons } from "@expo/vector-icons";

import { TimerProvider, useTimerContext } from "./src/context/TimerContext";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AppSettingScreen } from "./src/screens/AppSettingScreen";
import { SetTimerScreen } from "./src/screens/SetTimerScreen";
import { TimerScreen } from "./src/screens/TimerScreen";
import { ClockScreen } from "./src/screens/ClockScreen";
import { RootStackParamList } from "./src/types/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const adUnitId = process.env.EXPO_PUBLIC_BANNER_ID || "";

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainLayout() {
  const { isAdReady } = useTimerContext();
  const [currentScreen, setCurrentScreen] = useState<keyof RootStackParamList>("Home");

  const isTimerScreen = currentScreen === "Timer";

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <NavigationBar hidden={true} />

        <NavigationContainer
          onStateChange={(state) => {
            const currentRoute = state?.routes[state.index];
            if (currentRoute) {
              setCurrentScreen(currentRoute.name as keyof RootStackParamList);
            }
          }}
        >
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: true,
              headerTitleAlign: "center",
              headerShadowVisible: true,
              headerStyle: { backgroundColor: "#fff" },
              headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: "시험장 타이머",
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Setting")}
                    style={styles.headerButton}
                  >
                    <Ionicons name="settings-outline" size={24} color="#333" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen name="Setting" component={AppSettingScreen} options={{ title: "설정" }} />
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
    </GestureHandlerRootView>
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
  headerButton: {
    padding: 4,
  },
  adContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 4,
    backgroundColor: "#fff",
  },
});