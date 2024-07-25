import { Chess } from 'chess.js';
import { Color } from '../types/color';
import { SVG_PIECE_ELEMENTS, PieceChar } from '../types/chess';

/**
 * Converts a UCI move to SAN format.
 * @param chess - The Chess instance.
 * @param uciMove - The move in UCI format.
 * @returns The move in SAN format, or null if the move could not be made.
 */
export const uciMoveToSanMove = (chess: Chess, uciMove: string): string | null => {
  try {
    const chessCopy = new Chess(chess.fen());
    const result = chessCopy.move(uciMove);
    return result ? result.san : null;
  } catch {
    return null;
  }
};

/**
 * Gets the current turn players color.
 * @param chess - The Chess instance.
 * @returns The color of the player whose turn it is.
 */
export const getTurnPlayerColor = (chess: Chess): Color => {
  const turn = chess.turn(); // 'w' or 'b'
  return turn === 'w' ? Color.White : Color.Black;
};

/**
 * Returns the SVG for the given piece character and color.
 *
 * @param pieceChar - The character representing the piece (e.g., 'K' for king, 'Q' for queen).
 * @param color - The color of the piece.
 * @returns The SVG for the specified piece and color.
 */
export const getPieceSvg = (pieceChar: PieceChar, color: Color) => {
  if (color === Color.Neutral) {
    throw new Error('Neutral color does not have associated piece SVGs.');
  }

  // Construct the SVG file name
  const colorCode = color === Color.White ? 'w' : 'b';
  const pieceKey = `${colorCode}${pieceChar}` as keyof typeof SVG_PIECE_ELEMENTS;

  // Return the corresponding SVG
  return SVG_PIECE_ELEMENTS[pieceKey];
};

/**
 * Returns the SVG for the piece being moved in SAN notation.
 *
 * @param san - The SAN notation of the move.
 *              This can be in the form of a piece move (e.g., "Nf3" for knight move),
 *              a pawn move (e.g., "e5"), or castling move (e.g., "O-O" or "O-O-O").
 * @param color - The color of the piece.
 *                Must be either Color.White or Color.Black.
 *                Color.Neutral is not supported and will throw an error.
 * @returns The SVG for the piece being moved.
 *          For castling, it returns the SVG for the king.
 *          For all other moves, it returns the SVG for the piece specified in the SAN notation.
 */
export const getPieceSvgBySan = (san: string, color: Color) => {
  if (color === Color.Neutral) {
    throw new Error('Neutral color does not have associated piece SVGs.');
  }

  // Handle castling
  if (san === 'O-O' || san === 'O-O-O') {
    const kingSvg = getPieceSvg('K', color);
    return kingSvg;
  }

  // Determine the piece from the SAN notation
  const pieceChar: PieceChar = san[0] >= 'A' && san[0] <= 'Z' ? (san[0] as PieceChar) : 'P';

  return getPieceSvg(pieceChar, color);
};
