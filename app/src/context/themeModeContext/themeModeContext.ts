import { createContext } from 'react';
import { ThemeModeContextProps } from './types';

export const ThemeModeContext = createContext<ThemeModeContextProps | undefined>(undefined);
