import { ThemeMode } from '../../types/theme';

export enum BoardOrientation {
  Turn = 'turn', // Turn player on bottom
  White = 'white', // White on bottom
  Black = 'black', // Black on bottom
}

export interface UserPreferencesContextProps {
  mode: ThemeMode;
  toggleThemeMode: () => void;
  boardOrientation: BoardOrientation;
  setBoardOrientation: (boardOrientation: BoardOrientation) => void;
}
