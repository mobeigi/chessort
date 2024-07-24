import { Config } from 'chessground/config';

// Starting from empty board improves the initial load animation
const emptyBoardFen = '8/8/8/8/8/8/8/8 w - - 0 1';

export const initialConfig = {
  fen: emptyBoardFen,
  orientation: 'white',
  turnColor: 'white',
  lastMove: [],
  highlight: {
    lastMove: true,
    check: false,
  },
  movable: {
    free: false,
  },
  draggable: {
    enabled: false,
  },
  selectable: {
    enabled: false,
  },
  animation: {
    duration: 250,
  },
} as Config;
