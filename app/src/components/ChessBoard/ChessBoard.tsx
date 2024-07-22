import { Chessboard } from 'react-chessboard';
import { ChessBoardProps } from './types';

const customDarkSquareColor = '#b58b69';
const customLightSquareColor = '#f1dec2';
const customArrowColor = '#0f8ca8';

const lastMoveSquareHighlightColor = 'rgba(213, 180, 93, 0.6)'; // #d5b45d
const lastMoveSquareHighlightStyle = { backgroundColor: lastMoveSquareHighlightColor };

export const ChessBoard = ({ fen, lastMoveFrom, lastMoveTo }: ChessBoardProps) => {
  const moveSquares = {
    ...(lastMoveFrom && {
      [lastMoveFrom]: lastMoveSquareHighlightStyle,
    }),
    ...(lastMoveTo && {
      [lastMoveTo]: lastMoveSquareHighlightStyle,
    }),
  };

  return (
    <Chessboard
      position={fen}
      arePiecesDraggable={false}
      customDarkSquareStyle={{ backgroundColor: customDarkSquareColor }}
      customLightSquareStyle={{ backgroundColor: customLightSquareColor }}
      customBoardStyle={{ boxShadow: '0 5px 15px rgba(255, 255, 255, 0.1 )' }}
      customArrowColor={customArrowColor}
      customSquareStyles={{
        ...moveSquares,
      }}
    />
  );
};
