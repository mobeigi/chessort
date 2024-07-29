import { Chess } from 'chess.js';
import { GameState } from './types';
import { Difficulty } from '../../types/difficulty';

const emptyBoardFen = '8/8/8/8/8/8/8/8 w - - 0 1';

// Create some empty (cleared) boards as inital load placeholders
// This make first load animations smoother than using the DEFAULT_POSITION
const initialChessJs = new Chess();
initialChessJs.clear();
const curChessJs = new Chess();
curChessJs.clear();

const initialState: GameState = {
  moveDetails: [],
  solutionEvals: [],
  gameDetails: {
    gameId: '',
    fen: emptyBoardFen,
    difficulty: Difficulty.BEGINNER,
    positionHits: 0,
    gameHits: 0,
  },
  initialChessJs: initialChessJs,
  curChessJs: curChessJs,
  isPreview: false,
  previewedMove: null,
  revealed: false,
  isLoadingGame: true,
  isLoadingSolution: false,
};

export default initialState;
