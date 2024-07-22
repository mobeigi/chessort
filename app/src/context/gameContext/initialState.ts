import { Chess, DEFAULT_POSITION } from 'chess.js';
import { GameState } from './types';
import { Difficulty } from '../../types/difficulty';

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

export default initialState;
