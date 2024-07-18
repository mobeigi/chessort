import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardContainer } from './styled';
import { CardProps } from './types';

export const Card = ({ id }: CardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
    const transformStyle = CSS.Transform.toString(transform);
  
    return (
      <CardContainer
        ref={setNodeRef}
        $isDragging={isDragging}
        style={{ transform: transformStyle, transition }}
        {...attributes}
        {...listeners}
      >
        {id}
      </CardContainer>
    );
  };
