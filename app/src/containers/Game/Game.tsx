import { GameWrapper, ChessBoardWrapper, PanelWrapper } from './styled';
import ChessBoard from '../../components/ChessBoard';
import Panel from '../Panel';
import { useGameContext } from '../../hooks/useGameContext';
import { Square } from 'react-chessboard/dist/chessboard/types';

export const Game = () => {
  const { state } = useGameContext();

  const lastMoveFrom = state.previewedMove?.slice(0, 2) as Square;
  const lastMoveTo = state.previewedMove?.slice(2, 4) as Square;

  return (
    <GameWrapper>
      <ChessBoardWrapper>
        <ChessBoard fen={state.curChessJs.fen()} lastMoveFrom={lastMoveFrom} lastMoveTo={lastMoveTo} />
      </ChessBoardWrapper>
      <PanelWrapper>
        <Panel />
      </PanelWrapper>
    </GameWrapper>
  );
};
