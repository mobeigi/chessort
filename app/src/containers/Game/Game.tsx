import { GameWrapper, ChessBoardWrapper, PanelWrapper } from './styled';
import ChessGroundBoard from '../../components/ChessgroundBoard';
import Panel from '../Panel';
import { useGameContext } from '../../hooks/useGameContext';
import { Key, Color } from 'chessground/types';
import useUserPreferences from '../../hooks/useUserPreferences';
import { BoardOrientation } from '../../context/userPreferencesContext';
import { Color as ChessJsColor } from 'chess.js';

const chessJsTurnToColor = (turnColor: ChessJsColor): Color => {
  return turnColor === 'w' ? 'white' : 'black';
};

const getBoardOrientation = (boardOrientation: BoardOrientation, turnColor: ChessJsColor): Color => {
  const turnOrientation = turnColor === 'w' ? 'white' : 'black';

  switch (boardOrientation) {
    case BoardOrientation.Turn:
      return chessJsTurnToColor(turnColor);
    case BoardOrientation.White:
      return 'white';
    case BoardOrientation.Black:
      return 'black';
    default:
      console.error('Unknown board orientation:', boardOrientation);
      return turnOrientation; // fallback
  }
};

export const Game = () => {
  const { state } = useGameContext();
  const { boardOrientation } = useUserPreferences();

  const lastMoveFrom = state.previewedMove?.slice(0, 2) as Key;
  const lastMoveTo = state.previewedMove?.slice(2, 4) as Key;
  const lastMove = [...(lastMoveFrom && lastMoveTo ? [lastMoveFrom, lastMoveTo] : [])];

  // Set orientation based on user preference
  const orientation: Color = getBoardOrientation(boardOrientation, state.initialChessJs.turn());

  return (
    <GameWrapper>
      <ChessBoardWrapper>
        <ChessGroundBoard
          fen={state.curChessJs.fen()}
          turnColor={chessJsTurnToColor(state.initialChessJs.turn())}
          lastMove={lastMove}
          orientation={orientation}
        />
      </ChessBoardWrapper>
      <PanelWrapper>
        <Panel />
      </PanelWrapper>
    </GameWrapper>
  );
};
