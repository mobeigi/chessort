import { DrawShape } from 'chessground/draw';
import { Key, Color } from 'chessground/types';

export interface ChessGroundBoardProps {
  fen: string;
  lastMove: Key[];
  turnColor: Color;
  orientation: Color;
  shapes?: DrawShape[];
  onShapesChanged?: (shapes: DrawShape[]) => void;
}
