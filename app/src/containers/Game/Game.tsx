import { GameWrapper, ChessBoardWrapper, PanelWrapper } from './styled';
import ChessGroundBoard from '../../components/ChessgroundBoard';
import Panel from '../Panel';
import { useGameContext } from '../../hooks/useGameContext';
import { Key } from 'chessground/types';

export const Game = () => {
  const { state } = useGameContext();

  const lastMoveFrom = state.previewedMove?.slice(0, 2) as Key;
  const lastMoveTo = state.previewedMove?.slice(2, 4) as Key;
  const lastMove = [...(lastMoveFrom && lastMoveTo ? [lastMoveFrom, lastMoveTo] : [])];

  return (
    <GameWrapper>
      <ChessBoardWrapper>
        <ChessGroundBoard fen={state.curChessJs.fen()} lastMove={lastMove} />
      </ChessBoardWrapper>
      <PanelWrapper>
        <Panel />
      </PanelWrapper>
    </GameWrapper>
  );
};
