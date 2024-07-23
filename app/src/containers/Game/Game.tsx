import { GameWrapper, ChessBoardWrapper, PanelWrapper, CustomPieceIcon } from './styled';
import ChessBoard from '../../components/ChessBoard';
import Panel from '../Panel';
import { useGameContext } from '../../hooks/useGameContext';
import { Square, CustomPieces, CustomPieceFn, CustomPieceFnArgs } from 'react-chessboard/dist/chessboard/types';
import { PieceChar } from '../../types/chess';
import { getPieceSvg } from '../../utils/chessUtils';
import { Color } from '../../types/color';

const createCustomPiece = (piece: PieceChar, color: Color): CustomPieceFn => {
  return ({ squareWidth }: CustomPieceFnArgs) => (
    <CustomPieceIcon
      src={getPieceSvg(piece, color)}
      width={squareWidth}
      height={squareWidth}
      alt={`${color} ${piece}`}
    />
  );
};

export const Game = () => {
  const { state } = useGameContext();

  const lastMoveFrom = state.previewedMove?.slice(0, 2) as Square;
  const lastMoveTo = state.previewedMove?.slice(2, 4) as Square;

  const customPieces: CustomPieces = {
    wP: createCustomPiece('P', Color.White),
    wB: createCustomPiece('B', Color.White),
    wN: createCustomPiece('N', Color.White),
    wR: createCustomPiece('R', Color.White),
    wQ: createCustomPiece('Q', Color.White),
    wK: createCustomPiece('K', Color.White),
    bP: createCustomPiece('P', Color.Black),
    bB: createCustomPiece('B', Color.Black),
    bN: createCustomPiece('N', Color.Black),
    bR: createCustomPiece('R', Color.Black),
    bQ: createCustomPiece('Q', Color.Black),
    bK: createCustomPiece('K', Color.Black),
  };

  return (
    <GameWrapper>
      <ChessBoardWrapper>
        <ChessBoard
          fen={state.curChessJs.fen()}
          lastMoveFrom={lastMoveFrom}
          lastMoveTo={lastMoveTo}
          customPieces={customPieces}
        />
      </ChessBoardWrapper>
      <PanelWrapper>
        <Panel />
      </PanelWrapper>
    </GameWrapper>
  );
};
