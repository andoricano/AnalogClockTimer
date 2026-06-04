import { TimerProvider } from "./src/context/TimerContext";
import { TimerScreen } from "./src/screens/TimerScreen";

export default function App() {
  return (
    <TimerProvider>
      <TimerScreen />
    </TimerProvider>
  );
}