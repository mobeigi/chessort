export interface GameState {
  gameDetails: GameDetails;
  moveDetails: MoveDetail[];
}

export type GameDetails = {
    fen: string;
    difficulty: string;
  }


export type MoveDetail = {
    uciMove: string;
    sanMove: string;
    curRank: number;
    revealed: boolean;
    evalResults?: EvalResults;
}

export type EvalResults = {
    rank: number; // the real relative ranking for the position
    engineEval: string;
    engineOverallRank: number;
}

export interface GameAction {
  type: string;
  payload?: any;
}
