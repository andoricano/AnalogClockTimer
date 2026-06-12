export type RootStackParamList = {
  Home: undefined;
  Setting: undefined;
  SetTimer: { add?: boolean; id?: string };
  Timer: { 
    id?: string; 
  };
  Clock: undefined;
};