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
  display: flex;
  gap: 0.4em;
  background-color: #b58b69;
  color: #323232;
  padding: 1em 0.8em;
  border: 2px solid #000;
  border-radius: 0.2em;
  cursor: grab;
  align-items: center;
`;

export const CurrentRankWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
`

export const CurrentRankIconWrapper = styled.span`
  display: flex;
  
  svg {
    width: 16px;
    height: 16px;
  }
`

export const CurrentRankNumber = styled.span`
  font-weight: bold;
`

export const StatusIconWrapper = styled.span`
  display: block;
  width: 24px;
  height: 24px;
`

export const SanMoveWrapper = styled.span`
  display: flex;
  flex-grow: 1;
  justify-content: center;

  font-size: 1.4em;
  font-family: 'Chesan';
  color: #FFF;
  text-shadow: 0px 0px 4px #000;
`
