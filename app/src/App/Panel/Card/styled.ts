import styled from 'styled-components';

interface CardContainerProps {
  $isDragging: boolean;
}

export const CardContainer = styled.div.attrs<CardContainerProps>(({ $isDragging, style }) => ({
  style: {
    ...style,
    zIndex: $isDragging ? 999 : undefined,
    position: $isDragging ? 'relative' : undefined,
  },
}))<CardContainerProps>`
  padding: 1em;
  background-color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: grab;
`;

