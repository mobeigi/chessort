import { Chess } from 'chess.js';

export interface GameState {
  gameDetails: GameDetails;
  moveDetails: MoveDetail[];
  chessJs: Chess;
}

export enum Difficulty {
  BEGINNER = 'Beginner',
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  MASTER = 'Master',
}

export type GameDetails = {
  fen: string;
  difficulty: Difficulty;
};

export type MoveDetail = {
  uciMove: string;
  curRank: number;
  revealed: boolean;
  evalResult?: EvalResult;
};

export type EvalResult = {
  rank: number; // the real relative ranking for the position
  engineEval: string;
  engineOverallRank: number;
};

export interface GameAction {
  type: string;
  payload?: any;
}
