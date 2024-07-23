import { MoveDetail } from '../../../context/gameContext/types';
import { Color } from '../../../types/color';

export interface CardProps {
  moveDetail: MoveDetail;
  sanMove: string;
  turnPlayer: Color;
  revealed: boolean;
  correctRanks: number[];
  onClick: (uciMove: string) => void;
  isPreviewed: boolean;
}
