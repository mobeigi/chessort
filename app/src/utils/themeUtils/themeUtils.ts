import { ThemeMode } from '../../types/theme';

/**
 * Converts a hex color to an rgba color string.
 * @param {string} hex - The hex color string (e.g. '#eeeeee').
 * @param {number} alpha - The alpha value (e.g. 0.5).
 * @returns {string} The rgba color string.
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    throw new Error('Invalid HEX color.');
  }

  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const r = parseInt(c[0] + c[1], 16);
  const g = parseInt(c[2] + c[3], 16);
  const b = parseInt(c[4] + c[5], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
