export interface CardProps {
  cardDetail: CardDetails;
}

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

export enum Color {
  White = 'white',
  Black = 'black',
  Neutral = 'neutral'
}

// Unicode characters for chess pieces in Noto Sans Symbols 2
export type PieceChar = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';