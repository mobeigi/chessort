import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContainer, CurrentRankWrapper, CurrentRankNumber, StatusIconWrapper, SanMoveWrapper, MoveChessPiece, MoveNotation, EngineRankWrapper, EngineRank, EngineEvalWrapper } from './styled';
import { CardProps, Color, CardDetails } from './types';
import CorrectIcon from '../../../assets/icons/correct.svg?react';
import IncorrectIcon from '../../../assets/icons/incorrect.svg?react';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';
import { evaluateAdvantage, formatEvaluation, getPieceUnicode } from './utils';

const getStatusIcon = (cardDetail: CardDetails) => {
  if (!cardDetail.revealed) {
    return CurrentRankIcon;
  }
  if (cardDetail.curRank === cardDetail.evalResults?.rank) {
    return CorrectIcon;
  }
  return IncorrectIcon;
}

export const Card = ({ cardDetail }: CardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cardDetail.uciMove });
    const transformStyle = CSS.Transform.toString(transform);
    const advantageColor = cardDetail.revealed ? 
      evaluateAdvantage(cardDetail.evalResults!!.engineEval) :
      Color.Neutral;

    const engineEvalValue = cardDetail.revealed ? 
      formatEvaluation(cardDetail.evalResults!!.engineEval) : 
      "?";

    const StatusIcon = getStatusIcon(cardDetail);
    const pieceChar = getPieceUnicode(cardDetail.sanMove);
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
          <CurrentRankNumber>{cardDetail.curRank}</CurrentRankNumber>
        </CurrentRankWrapper>
        <SanMoveWrapper>
          <MoveChessPiece $color={turnToMove}>{pieceChar}</MoveChessPiece>
          <MoveNotation $color={turnToMove}>{cardDetail.sanMove}</MoveNotation>
        </SanMoveWrapper>
        {cardDetail.revealed && 
          <EngineRankWrapper>
            <EngineRank $rank={cardDetail.evalResults!!.engineOverallRank}></EngineRank> 
          </EngineRankWrapper>
        }
        <EngineEvalWrapper $advantageFor={advantageColor}>{engineEvalValue}</EngineEvalWrapper>
      </CardContainer>
    );
  };
