import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContainer, CurrentRankWrapper, CurrentRankNumber, StatusIconWrapper, SanMoveWrapper, EngineRankWrapper, EngineEvalWrapper } from './styled';
import { CardProps, Advantage, CardDetails } from './types';
import CorrectIcon from '../../../assets/icons/correct.svg?react';
import IncorrectIcon from '../../../assets/icons/incorrect.svg?react';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';
import { evaluateAdvantage, formatEvaluation } from './utils';

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
    const advantage = cardDetail.revealed ? 
      evaluateAdvantage(cardDetail.evalResults!!.engineEval) :
      Advantage.Neutral;

    const engineEvalValue = cardDetail.revealed ? 
      formatEvaluation(cardDetail.evalResults!!.engineEval) : 
      "?";

    const StatusIcon = getStatusIcon(cardDetail);

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
        <SanMoveWrapper>{cardDetail.sanMove}</SanMoveWrapper>
        <EngineRankWrapper>1</EngineRankWrapper>
        <EngineEvalWrapper $advantageFor={advantage}>{engineEvalValue}</EngineEvalWrapper>
      </CardContainer>
    );
  };
