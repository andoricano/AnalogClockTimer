import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { TimerProvider } from "./src/context/TimerContext";
import { TimerScreen } from "./src/screens/TimerScreen";

export default function App() {
  return (
    <TimerProvider>
      <StatusBar hidden={true} />
      <NavigationBar hidden={true} />
      <TimerScreen />
    </TimerProvider>
  );
}