import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContainer } from './styled';
import { CardProps } from './types';

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
        {cardDetail.curRank}&nbsp;
        {cardDetail.sanMove}&nbsp;
      </CardContainer>
    );
  };
