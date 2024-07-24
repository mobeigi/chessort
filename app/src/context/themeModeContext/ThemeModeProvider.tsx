import { useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../../types/theme';
import { getStoredTheme, setStoredTheme } from '../../utils/themeUtils';
import { ThemeModeContext } from './themeModeContext';

export const ThemeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Dark);

  useEffect(() => {
    const initialTheme = getStoredTheme();
    setMode(initialTheme);
  }, []);

  const toggleThemeMode = () => {
    const newMode = mode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
    setMode(newMode);
    setStoredTheme(newMode);
  };

  return <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>{children}</ThemeModeContext.Provider>;
};
