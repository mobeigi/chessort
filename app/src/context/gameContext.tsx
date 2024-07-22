import React, { createContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Difficulty, EvalResult } from './types';
import { Chess, DEFAULT_POSITION } from 'chess.js';

const initialFen = DEFAULT_POSITION;

const initialState: GameState = {
  moveDetails: [],
  solutionEvals: [],
  gameDetails: {
    fen: initialFen,
    difficulty: Difficulty.BEGINNER,
  },
  initialChessJs: new Chess(initialFen),
  curChessJs: new Chess(initialFen),
  isPreview: false,
  previewedMove: null,
  revealed: false,
  isLoadingGame: true,
  isLoadingSolution: false,
};

export const GameContext = createContext<{
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

    case 'SET_LOADING_GAME':
      return {
        ...state,
        isLoadingGame: action.payload,
      };

    case 'SET_LOADING_SOLUTION':
      return {
        ...state,
        isLoadingSolution: action.payload,
      };

    case 'UPSERT_SOLUTION': {
      const data = action.payload;

      // Create a map of uciMove to evalResult from the API response
      const moveDetailsMap = new Map<string, EvalResult>(
        data.solution.map((detail: { uciMove: string; evalResult: EvalResult }) => [detail.uciMove, detail.evalResult]),
      );

      // Update moveDetails in state
      const updatedMoveDetails = state.moveDetails.map((moveDetail) => ({
        ...moveDetail,
        evalResult: moveDetailsMap.get(moveDetail.uciMove) || { engineEval: '', engineOverallRank: -1 },
      }));

      // Update solutionEvals in state
      const solutionEvals = data.solution.map((detail: { evalResult: EvalResult }) => detail.evalResult.engineEval);

      return {
        ...state,
        moveDetails: updatedMoveDetails,
        solutionEvals,
      };
    }

    case 'REVEAL_MOVES':
      return {
        ...state,
        isLoadingSolution: false,
        revealed: true,
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
