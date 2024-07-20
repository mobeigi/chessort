import { Chess } from 'chess.js';
import { Color } from '../common/types';

/**
 * Makes a move on the chess board.
 * @param chess - The Chess instance.
 * @param uciMove - The move in UCI format.
 * @returns True if the move was successfully made, otherwise false.
 */
export const makeMove = (chess: Chess, uciMove: string): boolean => {
  const result = chess.move(uciMove);
  return result !== null;
};

/**
 * Undoes the last move on the chess board.
 * @param chess - The Chess instance.
 */
export const undoMove = (chess: Chess): void => {
  chess.undo();
};

/**
 * Converts a UCI move to SAN format.
 * @param chess - The Chess instance.
 * @param uciMove - The move in UCI format.
 * @returns The move in SAN format, or null if the move could not be made.
 */
export const uciMoveToSanMove = (chess: Chess, uciMove: string): string | null => {
  const chessCopy = new Chess(chess.fen());
  const result = chessCopy.move(uciMove);
  return result ? result.san : null;
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
