import { useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../../types/theme';
import { UserPreferencesContext } from './userPreferencesContext';
import { BoardOrientation } from './types';
import { getStoredTheme, setStoredTheme, getStoredBoardOrientation, setStoredBoardOrientation } from './utils';

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Dark);
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>(BoardOrientation.Turn);

  useEffect(() => {
    const initialTheme = getStoredTheme();
    const initialBoardOrientation = getStoredBoardOrientation();

    setMode(initialTheme);
    setBoardOrientation(initialBoardOrientation);
  }, []);

  const toggleThemeMode = () => {
    const newMode = mode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
    setMode(newMode);
    setStoredTheme(newMode);
  };

  const setBoardOrientationFn = (boardOrientation: BoardOrientation) => {
    setBoardOrientation(boardOrientation);
    setStoredBoardOrientation(boardOrientation);
  };

  return (
    <UserPreferencesContext.Provider
      value={{ mode, toggleThemeMode, boardOrientation, setBoardOrientation: setBoardOrientationFn }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
