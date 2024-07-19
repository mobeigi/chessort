import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContainer, CurrentRankWrapper, CurrentRankIconWrapper, CurrentRankNumber, StatusIconWrapper, SanMoveWrapper, EngineRankWrapper, EngineEvalWrapper } from './styled';
import { CardProps, Advantage } from './types';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';
import { evaluateAdvantage, formatEvaluation } from './utils';

export const Card = ({ cardDetail }: CardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cardDetail.uciMove });
    const transformStyle = CSS.Transform.toString(transform);
    const advantage = cardDetail.revealed ? 
      evaluateAdvantage(cardDetail.evalResults!!.engineEval) :
      Advantage.Neutral;

    const engineEvalValue = cardDetail.revealed ? 
      formatEvaluation(cardDetail.evalResults!!.engineEval) : 
      "?";

    return (
      <CardContainer
        ref={setNodeRef}
        $isDragging={isDragging}
        style={{ transform: transformStyle, transition }}
        {...attributes}
        {...listeners}
      >
        <StatusIconWrapper>@</StatusIconWrapper>
        <CurrentRankWrapper>
          <CurrentRankIconWrapper>
            <CurrentRankIcon />
          </CurrentRankIconWrapper>
          <CurrentRankNumber>{cardDetail.curRank}</CurrentRankNumber>
        </CurrentRankWrapper>
        <SanMoveWrapper>{cardDetail.sanMove}</SanMoveWrapper>
        <EngineRankWrapper>1</EngineRankWrapper>
        <EngineEvalWrapper $advantageFor={advantage}>{engineEvalValue}</EngineEvalWrapper>
      </CardContainer>
    );
  };
