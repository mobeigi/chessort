import { useReducer, ReactNode } from 'react';
import { GameContext } from './gameContext';
import initialState from './initialState';
import gameReducer from './reducer';

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};
