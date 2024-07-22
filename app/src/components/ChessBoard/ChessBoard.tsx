import { Chessboard } from 'react-chessboard';
import { ChessBoardProps } from './types';
import { Square } from 'chess.js';

const customDarkSquareColor = '#b58b69';
const customLightSquareColor = '#f1dec2';
const customArrowColor = '#0f8ca8';

const darkSquareHighlightColor = 'rgba(213, 180, 93, 0.8)'; // #d5b45d
const lightSquareHighlightColor = 'rgba(213, 180, 93, 0.6)'; // #d5b45d
const darkSquareHighlightStyle = { backgroundColor: darkSquareHighlightColor };
const lightSquareHighlightStyle = { backgroundColor: lightSquareHighlightColor };

const isDarkSquare = (square: Square) => {
  const files = 'abcdefgh';
  const rank = parseInt(square[1], 10); // Extract the rank (number part)
  const file = files.indexOf(square[0]) + 1; // Extract the file (letter part) and convert to index (1-8)

  // Sum the file and rank indices, if the sum is odd, the square is dark
  return (file + rank) % 2 === 1;
};

export const ChessBoard = ({ fen, lastMoveFrom, lastMoveTo }: ChessBoardProps) => {
  const moveSquares = {
    ...(lastMoveFrom && {
      [lastMoveFrom]: isDarkSquare(lastMoveFrom) ? darkSquareHighlightStyle : lightSquareHighlightStyle,
    }),
    ...(lastMoveTo && {
      [lastMoveTo]: isDarkSquare(lastMoveTo) ? darkSquareHighlightStyle : lightSquareHighlightStyle,
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
