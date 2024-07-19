import { PieceChar } from './types';

// Unicode characters for chess pieces in Noto Sans Symbols 2
export const WHITE_PIECES: Record<PieceChar, string> = {
  K: '♔',
  Q: '♕',
  R: '♖',
  B: '♗',
  N: '♘',
  P: '♙',
};

export const BLACK_PIECES: Record<PieceChar, string> = {
  K: '♚',
  Q: '♛',
  R: '♜',
  B: '♝',
  N: '♞',
  P: '♟',
};
