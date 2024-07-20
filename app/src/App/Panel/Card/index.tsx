import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CardContainer,
  CurrentRankWrapper,
  CurrentRankNumber,
  StatusIconWrapper,
  SanMoveWrapper,
  MoveChessPiece,
  MoveNotation,
  EngineRankWrapper,
  EngineRank,
  EngineEvalWrapper,
} from './styled';
import { CardProps } from './types';
import { MoveDetail } from '../../../context/types';
import CorrectIcon from '../../../assets/icons/correct.svg?react';
import IncorrectIcon from '../../../assets/icons/incorrect.svg?react';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';
import { evaluateAdvantage, formatEvaluation, getPieceUnicode, getOrdinalSuffix } from './utils';
import { Tooltip } from 'react-tooltip';
import { useGameContext } from '../../../context/gameContext';
import { uciMoveToSanMove, getTurnPlayerColor } from '../../../utils/chessJsUtils';
import { Color } from '../../../common/types';

const getStatusIcon = (moveDetail: MoveDetail) => {
  if (!moveDetail.revealed) {
    return CurrentRankIcon;
  }
  if (moveDetail.curRank === moveDetail.evalResult?.rank) {
    return CorrectIcon;
  }
  return IncorrectIcon;
};

const getEngineRankTooltipText = (moveDetail: MoveDetail) => {
  if (!moveDetail.revealed) {
    return null;
  }

  return (
    <>
      This is the engine's <strong>{getOrdinalSuffix(moveDetail.evalResult!.engineOverallRank)}</strong> best move.
    </>
  );
};

export const Card = ({ moveDetail }: CardProps) => {
  const { state } = useGameContext();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: moveDetail.uciMove,
  });
  const transformStyle = CSS.Transform.toString(transform);
  const advantageColor = moveDetail.revealed ? evaluateAdvantage(moveDetail.evalResult!.engineEval) : Color.Neutral;

  const engineRankTooltipText = getEngineRankTooltipText(moveDetail);

  const engineEvalValue = moveDetail.revealed ? formatEvaluation(moveDetail.evalResult!.engineEval) : '?';

  const StatusIcon = getStatusIcon(moveDetail);

  const sanMove = uciMoveToSanMove(state.chessJs, moveDetail.uciMove)!;
  const pieceChar = getPieceUnicode(sanMove);
  const turnPlayerColor = getTurnPlayerColor(state.chessJs);

  return (
    <CardContainer
      ref={setNodeRef}
      $isDragging={isDragging}
      style={{ transform: transformStyle, transition }}
      {...attributes}
      {...listeners}
    >
      <CurrentRankWrapper>
        <StatusIconWrapper>
          <StatusIcon />
        </StatusIconWrapper>
        <CurrentRankNumber>{moveDetail.curRank}</CurrentRankNumber>
      </CurrentRankWrapper>
      <SanMoveWrapper>
        <MoveChessPiece $color={turnPlayerColor}>{pieceChar}</MoveChessPiece>
        <MoveNotation $color={turnPlayerColor}>{sanMove}</MoveNotation>
      </SanMoveWrapper>
      {moveDetail.revealed && (
        <>
          <Tooltip id={`engine-rank-tooltip-${moveDetail.uciMove}`} place="top">
            {engineRankTooltipText}
          </Tooltip>
          <EngineRankWrapper data-tooltip-id={`engine-rank-tooltip-${moveDetail.uciMove}`}>
            <EngineRank $rank={moveDetail.evalResult!.engineOverallRank}></EngineRank>
          </EngineRankWrapper>
        </>
      )}
      <EngineEvalWrapper $advantageFor={advantageColor}>{engineEvalValue}</EngineEvalWrapper>
    </CardContainer>
  );
};
