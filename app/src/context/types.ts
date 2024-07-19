export type CardDetails = {
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

export interface GameState {
  cardDetails: CardDetails[];
  // Add other game state properties here
}

export interface GameAction {
  type: string;
  payload?: any;
}
