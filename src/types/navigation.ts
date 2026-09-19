export type TimerSetMode = 'create' | 'edit' | 'view';

export type RootStackParamList = {
  Home: undefined;
  Setting: undefined;
  SetTimer: { mode: TimerSetMode; id?: string };
  Timer: { id?: string };
  Clock: undefined;
};