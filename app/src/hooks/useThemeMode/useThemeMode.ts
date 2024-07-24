import { useContext } from 'react';
import { ThemeModeContext } from '../../context/themeModeContext';

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
