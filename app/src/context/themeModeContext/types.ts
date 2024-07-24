import { ThemeMode } from '../../types/theme';

export interface ThemeModeContextProps {
  mode: ThemeMode;
  toggleThemeMode: () => void;
}
