import { Square } from 'react-chessboard/dist/chessboard/types';
import { CustomPieces } from 'react-chessboard/dist/chessboard/types';
export interface ChessBoardProps {
  fen: string;
  lastMoveFrom?: Square;
  lastMoveTo?: Square;
  customPieces?: CustomPieces;
}
export type SelectedSquares = {
  [key: string]: React.CSSProperties | undefined;
};
