import { MoveDetail } from '../../../context/types';
import { Color } from '../../../common/types';

export interface CardProps {
  moveDetail: MoveDetail;
  sanMove: string;
  turnPlayer: Color;
  revealed: boolean;
  correctRanks: number[];
  onClick: (uciMove: string) => void;
  isPreviewed: boolean;
}

// Unicode characters for chess pieces in Noto Sans Symbols 2
export type PieceChar = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
