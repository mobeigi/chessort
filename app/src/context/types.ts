import { Chess } from 'chess.js';

export interface GameState {
  gameDetails: GameDetails;
  moveDetails: MoveDetail[];
  solutionEvals: string[];
  initialChessJs: Chess /* initial reference board, should not be mutated via moves */;
  curChessJs: Chess /* initial board which can be moved and is linked to chess board */;
  isPreview: boolean;
  previewedMove: string | null;
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  MASTER = 'MASTER',
}

export type GameDetails = {
  fen: string;
  difficulty: Difficulty;
  revealed: boolean;
};

export type MoveDetail = {
  uciMove: string;
  curRank: number;
  evalResult?: EvalResult;
};

export type EvalResult = {
  engineEval: string;
  engineOverallRank: number;
};

export interface GameAction {
  type: string;
  payload?: any;
}
