import { Color, PieceChar } from './types';
import { BLACK_PIECES } from './constants';

/**
 * Evaluates the given chess engine evaluation string and determines the advantage.
 *
 * @param evaluation - The evaluation string from the chess engine.
 *                      This can be in the form of a centipawn evaluation (e.g., "+265", "-462")
 *                      or a mate evaluation (e.g., "#1", "#-1").
 * @returns Advantage - Returns Advantage.White if white is winning,
 *                      Advantage.Black if black is winning,
 *                      or Advantage.Neutral if the position is balanced.
 */
export const evaluateAdvantage = (evaluation: string): Color => {
  if (evaluation.startsWith('#')) {
    const mateValue = parseInt(evaluation.slice(1));
    return mateValue > 0 ? Color.White : Color.Black;
  }

  const centipawnValue = parseFloat(evaluation);
  if (centipawnValue > 0) {
    return Color.White;
  } else if (centipawnValue < 0) {
    return Color.Black;
  } else {
    return Color.Neutral;
  }
};

/**
 * Formats the given chess engine evaluation string to a more readable format.
 *
 * @param evaluation - The evaluation string from the chess engine.
 *                      This can be in the form of a centipawn evaluation (e.g., "+265", "-462")
 *                      or a mate evaluation (e.g., "#1", "#-1").
 * @returns string - Returns the formatted evaluation string. Mate evaluations are prefixed
 *                   with "+" or "-" (e.g., "+M1", "-M1"). Centipawn evaluations are converted
 *                   to decimal form and prefixed with "+" or "-" (e.g., "+2.65", "-4.62").
 *                   If the evaluation is "0.00", an empty string is returned.
 */
export const formatEvaluation = (evaluation: string): string => {
  if (evaluation.startsWith('#')) {
    const mateValue = parseInt(evaluation.slice(1));
    return `${mateValue > 0 ? '+' : '-'}M${Math.abs(mateValue)}`;
  }

  const centipawnValue = parseFloat(evaluation);
  const sign = determineSign(centipawnValue);
  return `${sign}${Math.abs(centipawnValue / 100).toFixed(2)}`;
};

const determineSign = (centipawnValue: number): string => {
  if (centipawnValue === 0) {
    return '';
  }
  return centipawnValue > 0 ? '+' : '-';
};

/**
 * Returns the Unicode character for the black piece being moved in SAN notation.
 *
 * @param san - The SAN notation of the move.
 *              This can be in the form of a piece move (e.g., "Nf3" for knight move)
 *              or a pawn move (e.g., "e5").
 * @returns The Unicode character for the black piece being moved.
 *          Uses black piece symbols from the "Noto Sans Symbols 2" font.
 */
export const getPieceUnicode = (san: string): string => {
  // Determine the piece from the SAN notation
  const pieceChar = san[0] as PieceChar;
  let pieceUnicode = '';

  if (pieceChar >= 'A' && pieceChar <= 'Z') {
    // If the first character is an uppercase letter, it's a piece other than a pawn
    pieceUnicode = BLACK_PIECES[pieceChar];
  } else {
    // If the first character is not an uppercase letter, it's a pawn move
    pieceUnicode = BLACK_PIECES['P'];
  }

  return pieceUnicode;
};

/**
 * Returns the base color (background color) based on the given color.
 *
 * @param color - The color indicating who has the advantage (Color.White, Color.Black, or Color.Neutral).
 * @returns The base color as a string.
 */
export const getBaseColor = (color: Color): string => {
  switch (color) {
    case Color.White:
      return '#f0f0f0';
    case Color.Black:
      return '#312e2b';
    case Color.Neutral:
      return '#808080';
    default:
      return '#fff';
  }
};

/**
 * Returns the overlay color (text color) based on the given color.
 *
 * @param color - The color indicating who has the advantage (Color.White, Color.Black, or Color.Neutral).
 * @returns The overlay color as a string.
 */
export const getOverlayColor = (color: Color): string => {
  switch (color) {
    case Color.White:
      return '#312e2b';
    case Color.Black:
      return '#fff';
    case Color.Neutral:
      return '#fff';
    default:
      return '#312e2b';
  }
};
