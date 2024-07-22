import { Chess } from 'chess.js';
import { Difficulty } from '../../types/difficulty';
import { EvalResult } from '../../services/chessortServer';

export interface GameState {
  gameDetails: GameDetails; // Information about the game puzzle
  moveDetails: MoveDetail[]; // Information about the list of possible moves
  solutionEvals: string[]; // The sorted evaluations to the correct answer. This can be computed from moveDetails but is in the state for convinience.
  initialChessJs: Chess; // initial reference board, should not be mutated via moves
  curChessJs: Chess; // initial board which can be moved and is linked to chess board
  isPreview: boolean; // if the curChessJs is set to preview a move
  previewedMove: string | null; // the UCI move being previewed or null if we're not previewing a move
  revealed: boolean; // if the game has been revealed (solution being shown)
  isInitialLoadCompleted: boolean; // true after very first initial game is loaded
  isLoadingGame: boolean; // if we're in process of loading a game
  isLoadingSolution: boolean; // if we're in process of loading a solution
}

export type GameDetails = {
  gameId: string;
  fen: string;
  difficulty: Difficulty;
};

export type MoveDetail = {
  uciMove: string;
  curRank: number;
  evalResult?: EvalResult;
};

export interface GameAction {
  type: string;
  payload?: any; // TODO: Type this properly instead of using any
}
