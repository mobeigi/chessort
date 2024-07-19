import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContainer, CurrentRankWrapper, CurrentRankIconWrapper, CurrentRankNumber, StatusIconWrapper, SanMoveWrapper } from './styled';
import { CardProps } from './types';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';

export const Card = ({ cardDetail }: CardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cardDetail.uciMove });
  
    const transformStyle = CSS.Transform.toString(transform);
  
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
        <span>C</span>
        <span>EVAL</span>
      </CardContainer>
    );
  };
