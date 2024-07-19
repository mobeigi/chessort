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
import { CardProps, Color } from './types';
import { MoveDetail } from '../../../context/types';
import CorrectIcon from '../../../assets/icons/correct.svg?react';
import IncorrectIcon from '../../../assets/icons/incorrect.svg?react';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';
import { evaluateAdvantage, formatEvaluation, getPieceUnicode } from './utils';

const getStatusIcon = (moveDetail: MoveDetail) => {
  if (!moveDetail.revealed) {
    return CurrentRankIcon;
  }
  if (moveDetail.curRank === moveDetail.evalResults?.rank) {
    return CorrectIcon;
  }
  return IncorrectIcon;
};

export const Card = ({ moveDetail }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: moveDetail.uciMove,
  });
  const transformStyle = CSS.Transform.toString(transform);
  const advantageColor = moveDetail.revealed ? evaluateAdvantage(moveDetail.evalResults!.engineEval) : Color.Neutral;

  const engineEvalValue = moveDetail.revealed ? formatEvaluation(moveDetail.evalResults!.engineEval) : '?';

  const StatusIcon = getStatusIcon(moveDetail);
  const pieceChar = getPieceUnicode(moveDetail.sanMove);
  const turnToMove = Color.White; // TODO: This should be set from some sort of game state object that contains a FEN

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
        <MoveChessPiece $color={turnToMove}>{pieceChar}</MoveChessPiece>
        <MoveNotation $color={turnToMove}>{moveDetail.sanMove}</MoveNotation>
      </SanMoveWrapper>
      {moveDetail.revealed && (
        <EngineRankWrapper>
          <EngineRank $rank={moveDetail.evalResults!.engineOverallRank}></EngineRank>
        </EngineRankWrapper>
      )}
      <EngineEvalWrapper $advantageFor={advantageColor}>{engineEvalValue}</EngineEvalWrapper>
    </CardContainer>
  );
};
