import { MoveDetail } from '../../../context/types'
export interface CardProps {
  moveDetail: MoveDetail;
}

export enum Color {
  White = 'white',
  Black = 'black',
  Neutral = 'neutral'
}

// Unicode characters for chess pieces in Noto Sans Symbols 2
export type PieceChar = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
