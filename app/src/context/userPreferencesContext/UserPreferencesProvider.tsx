import { useState, useEffect, ReactNode } from 'react';
import { ThemeMode } from '../../types/theme';
import { UserPreferencesContext } from './userPreferencesContext';
import { BoardOrientation } from './types';
import {
  getStoredTheme,
  setStoredTheme,
  getStoredBoardOrientation,
  setStoredBoardOrientation,
  setStoredOnboardingComplete,
  getStoredOnboardingComplete,
} from './utils';

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(ThemeMode.Dark);
  const [boardOrientation, setBoardOrientation] = useState<BoardOrientation>(BoardOrientation.Turn);
  const [onboardingCompelte, setOnboardingComplete] = useState<boolean>(false);

  useEffect(() => {
    const initialTheme = getStoredTheme();
    const initialBoardOrientation = getStoredBoardOrientation();
    const initialOnboardComplete = getStoredOnboardingComplete();

    setMode(initialTheme);
    setBoardOrientation(initialBoardOrientation);
    setOnboardingComplete(initialOnboardComplete);
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

  const setOnboardingCompleteFn = (onboardingCompelte: boolean) => {
    setOnboardingComplete(onboardingCompelte);
    setStoredOnboardingComplete(onboardingCompelte);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        mode,
        toggleThemeMode,
        boardOrientation,
        setBoardOrientation: setBoardOrientationFn,
        onboardingCompelte,
        setOnboardingComplete: setOnboardingCompleteFn,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
