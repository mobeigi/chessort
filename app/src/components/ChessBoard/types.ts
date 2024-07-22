import { Square } from 'react-chessboard/dist/chessboard/types';
export interface ChessBoardProps {
  fen: string;
  lastMoveFrom?: Square;
  lastMoveTo?: Square;
}
export type SelectedSquares = {
  [key: string]: React.CSSProperties | undefined;
};
