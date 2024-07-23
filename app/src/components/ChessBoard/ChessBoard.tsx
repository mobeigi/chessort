import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { ChessBoardProps, SelectedSquares } from './types';
import { Square } from 'chess.js';

const customDarkSquareColor = '#b58b69';
const customLightSquareColor = '#f1dec2';
const customArrowColor = '#459949';

const selectedSquareColor = 'rgba(90, 167, 204, 0.6)'; // #5aa7cc
const selectedSquareStyle = { backgroundColor: selectedSquareColor };

const lastMoveSquareHighlightColor = 'rgba(213, 180, 93, 0.6)'; // #d5b45d
const lastMoveSquareHighlightStyle = { backgroundColor: lastMoveSquareHighlightColor };

export const ChessBoard = ({ fen, lastMoveFrom, lastMoveTo, customPieces }: ChessBoardProps) => {
  const [selectedSquares, setSelectedSquares] = useState<SelectedSquares>({});

  const onSquareClick = () => {
    setSelectedSquares({});
  };

  const onSquareRightClick = (square: Square) => {
    setSelectedSquares((prevSelectedSquares) => {
      const newSelectedSquares = { ...prevSelectedSquares };

      if (newSelectedSquares[square]) {
        delete newSelectedSquares[square];
      } else {
        newSelectedSquares[square] = selectedSquareStyle;
      }

      return newSelectedSquares;
    });
  };

  const moveSquares = {
    ...(lastMoveFrom && {
      [lastMoveFrom]: lastMoveSquareHighlightStyle,
    }),
    ...(lastMoveTo && {
      [lastMoveTo]: lastMoveSquareHighlightStyle,
    }),
  };

  // Reset selected squares if fen changes (change made to board position)
  useEffect(() => {
    setSelectedSquares({});
  }, [fen]);

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
        ...selectedSquares,
      }}
      customPieces={customPieces}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
    />
  );
};
