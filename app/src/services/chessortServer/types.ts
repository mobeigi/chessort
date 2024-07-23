import { Difficulty } from '../../types/difficulty';

export type GameApiResponse = {
  difficulty: Difficulty;
  fen: string;
  gameId: string;
  uciMoves: string[];
};

export type EvalResult = {
  engineEval: string;
  engineOverallRank: number;
};

export type SolutionMove = {
  evalResult: EvalResult;
  uciMove: string;
};

export type SolutionApiResponse = {
  gameId: string;
  solution: SolutionMove[];
};
