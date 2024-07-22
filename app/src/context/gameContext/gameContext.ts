import React, { createContext } from 'react';
import { GameState, GameAction } from './types';
import initialState from './initialState';

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});
