import { encode as base64Encode } from 'base64-url';

// Utility function to encode FEN and UCI moves into a unique game ID
export const encodeIntoUniqueGameId = (fen: string, uciMoves: string[]): string => {
  // Sort the UCI moves alphanumerically
  const sortedMoves = uciMoves.slice().sort();

  // Create the string in the desired format
  const gameString = [fen, ...sortedMoves].join(',');

  // Encode the string into Base64
  return base64Encode(gameString);
};
