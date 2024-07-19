import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { GameState, GameAction} from './types';

const initialState: GameState = {
  moveDetails: [
    { 
      uciMove: 'e2e4', 
      sanMove: 'Qd6', 
      curRank: 1, 
      revealed: true,
      evalResults: {
        rank: 1,
        engineEval: '+265', 
        engineOverallRank: 1
      }
    },
    { 
      uciMove: 'd2d4', 
      sanMove: 'Nd4', 
      curRank: 2, 
      revealed: true,
      evalResults: {
        rank: 2,
        engineEval: '-125', 
        engineOverallRank: 2
      }
    },
    { 
      uciMove: 'g1f3', 
      sanMove: 'h7h8=N', 
      curRank: 3, 
      revealed: true,
      evalResults: {
        rank: 4,
        engineEval: '#-4', 
        engineOverallRank: 37
      }
    },
    { 
      uciMove: 'c2c4', 
      sanMove: 'c4', 
      curRank: 4, 
      revealed: false 
    }
  ],
  gameDetails: {
    fen: 'start',
    difficulty: 'easy' // TODO: Make into enum
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'UPDATE_MOVE_DETAILS':
      return {
        ...state,
        moveDetails: action.payload,
      };
    case 'UPDATE_GAME':
      return {
        ...state,
        gameDetails: { ...state.gameDetails, ...action.payload }
      };
    default:
      return state;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
