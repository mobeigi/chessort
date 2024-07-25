import { ThemeMode } from '../../types/theme';
import { BoardOrientation } from './types';

/**
 * Retrieves the stored theme from local storage or falls back to the user's preference.
 * @returns {ThemeMode} The theme mode
 */
export const getStoredTheme = (): ThemeMode => {
  const storedTheme = localStorage.getItem('themeMode');
  if (storedTheme) {
    return storedTheme as ThemeMode;
  }

  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return userPrefersDark ? ThemeMode.Dark : ThemeMode.Light;
};

/**
 * Saves the selected theme to local storage.
 * @param {ThemeMode} theme - The theme mode to store
 */
export const setStoredTheme = (theme: ThemeMode): void => {
  localStorage.setItem('themeMode', theme);
};

/**
 * Retrieves the stored board orientation from local storage or falls back to the user's preference.
 * @returns {BoardOrientation} The board orientation
 */
export const getStoredBoardOrientation = (): BoardOrientation => {
  const storedBoardOrientation = localStorage.getItem('boardOrientation');
  if (storedBoardOrientation) {
    return storedBoardOrientation as BoardOrientation;
  }
  return BoardOrientation.Turn;
};

/**
 * Saves the selected board orientation to local storage.
 * @param {BoardOrientation} boardOrientation - The board orientation to store
 */
export const setStoredBoardOrientation = (boardOrientation: BoardOrientation): void => {
  localStorage.setItem('boardOrientation', boardOrientation);
};
