import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { GameState, GameAction, Difficulty } from './types';
import { Chess } from 'chess.js';

const initialFen = '2kr3r/pp4p1/2pb2p1/4qp2/3p2P1/3Q3P/PP2PBB1/R2R2K1 w - - 0 21'; // TODO: Change back to 'start'

const initialState: GameState = {
  moveDetails: [
    {
      uciMove: 'd3d4',
      curRank: 1,
      evalResult: {
        engineEval: '+332',
        engineOverallRank: 1,
      },
    },
    {
      uciMove: 'd3f3',
      curRank: 2,
      evalResult: {
        engineEval: '+283',
        engineOverallRank: 2,
      },
    },
    {
      uciMove: 'd1f1',
      curRank: 3,
      evalResult: {
        engineEval: '#-1',
        engineOverallRank: 43,
      },
    },
    {
      uciMove: 'g2f1',
      curRank: 4,
      evalResult: {
        engineEval: '#-1',
        engineOverallRank: 44,
      },
    },
  ],
  solutionEvals: ['+332', '+283', '#-1', '#-1'], // TODO: reset back to empty array
  gameDetails: {
    fen: initialFen,
    difficulty: Difficulty.BEGINNER,
    revealed: false,
  },
  initialChessJs: new Chess(initialFen),
  curChessJs: new Chess(initialFen),
  isPreview: false,
  previewedMove: null,
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
    case 'NEW_GAME': {
      const fen = action.payload.fen;
      const moveDetails = action.payload.uciMoves.map((uciMove: string, index: number) => ({
        uciMove,
        curRank: index + 1, // Assign rank based on the position in the array
      }));

      const difficulty = action.payload.difficulty as Difficulty;

      return {
        ...initialState, // Reset to initial state, this will give us a fresh game state that we can update
        moveDetails: moveDetails,
        gameDetails: { ...initialState.gameDetails, fen: fen, difficulty: difficulty },
        initialChessJs: new Chess(fen),
        curChessJs: new Chess(fen),
      };
    }
    case 'REVEAL_MOVES':
      return {
        ...state,
        moveDetails: state.moveDetails.map((moveDetail) => ({
          ...moveDetail,
          revealed: true,
        })),
        gameDetails: {
          ...state.gameDetails,
          revealed: true,
        },
      };
    case 'PREVIEW_MOVE': {
      if (!state.isPreview) {
        const newChessInstance = new Chess(state.curChessJs.fen());
        const result = newChessInstance.move(action.payload);
        return {
          ...state,
          isPreview: true,
          previewedMove: action.payload,
          curChessJs: result ? newChessInstance : state.curChessJs, // Update only if the move was successful
        };
      }
      return state;
    }

    case 'UNPREVIEW_MOVE': {
      if (state.isPreview) {
        return {
          ...state,
          isPreview: false,
          previewedMove: null,
          curChessJs: state.initialChessJs /* Set to intial chess JS which is equivalent to undoing 1 move */,
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGameContext = () => useContext(GameContext);
