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
import { Color } from '../../../common/types';

const getStatusIcon = (revealed: boolean, curRank: number, correctRanks: number[]) => {
  if (!revealed) {
    return CurrentRankIcon;
  }
  if (correctRanks.includes(curRank)) {
    return CorrectIcon;
  }
  return IncorrectIcon;
};

const getEngineRankTooltipText = (moveDetail: MoveDetail) => (
  <>
    This is the engine's <strong>{getOrdinalSuffix(moveDetail.evalResult!.engineOverallRank)}</strong> best move.
  </>
);

export const Card = ({ moveDetail, sanMove, turnPlayer, revealed, correctRanks }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: moveDetail.uciMove,
  });
  const transformStyle = CSS.Transform.toString(transform);

  const displayedRank = revealed ? correctRanks.join('/') : moveDetail.curRank;

  const advantageColor = revealed ? evaluateAdvantage(moveDetail.evalResult!.engineEval) : Color.Neutral;

  const engineRankTooltipText = revealed ? getEngineRankTooltipText(moveDetail) : null;

  const engineEvalValue = revealed ? formatEvaluation(moveDetail.evalResult!.engineEval) : '?';

  const StatusIcon = getStatusIcon(revealed, moveDetail.curRank, correctRanks);
  const pieceChar = getPieceUnicode(sanMove);

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
        <CurrentRankNumber>{displayedRank}</CurrentRankNumber>
      </CurrentRankWrapper>
      <SanMoveWrapper>
        <MoveChessPiece $color={turnPlayer}>{pieceChar}</MoveChessPiece>
        <MoveNotation $color={turnPlayer}>{sanMove}</MoveNotation>
      </SanMoveWrapper>
      {revealed && (
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
