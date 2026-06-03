import { TimerProvider } from './context/TimerContext';
import { TimerScreen } from './screens/TimerScreen';

function App() {
  return (
    <TimerProvider>
      <TimerScreen />
    </TimerProvider>
  );
}

export default App;