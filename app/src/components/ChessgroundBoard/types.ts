import { Key, Color } from 'chessground/types';

export interface ChessGroundBoardProps {
  fen: string;
  lastMove: Key[];
  orientation: Color;
}
