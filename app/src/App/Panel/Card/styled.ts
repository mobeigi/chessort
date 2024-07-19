import styled from 'styled-components';
import { Advantage } from './types';

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
  background-color: #b58b69;
  color: #323232;
  padding: 1em 0.8em;
  border: 2px solid #000;
  border-radius: 0.2em;
  cursor: grab;
  align-items: center;

  > *:not(:first-child) {
    margin-left: 0.4em; /* Set the default gap */
  }

  > *:nth-child(2) {
    margin-left: 0.2em; /* No gap between 1st & 2nd child */
  }
`;

export const CurrentRankWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 0.2em;
`

export const StatusIconWrapper = styled.span`
  display: flex;
  
  svg {
    width: 16px;
    height: 16px;
  }
`

export const CurrentRankNumber = styled.span`
  font-weight: bold;
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

export const EngineRankWrapper = styled.span``

interface EngineEvalWrapperProps {
  $advantageFor: Advantage;
}

export const EngineEvalWrapper = styled.span<EngineEvalWrapperProps>`
  display: flex;  
  width: 3em;
  justify-content: center;
  background-color: ${(props) => { /* Background colour based on who has the advantage */
    switch (props.$advantageFor) {
      case Advantage.White:
        return '#fff';
      case Advantage.Black:
        return '#312e2b';
      case Advantage.Neutral:
        return '#808080';
      default:
        return '#fff';
    }
  }};
  color: ${(props) => {
    switch (props.$advantageFor) {
      case Advantage.White:
        return '#312e2b';
      case Advantage.Black:
        return '#fff';
      case Advantage.Neutral:
        return '#fff';
      default:
        return '#312e2b';
    }
  }};
  border-radius: 0.2em;
  padding: 0.2em 0.3em;
  font-size: 0.8em;
  font-weight: bold;
  font-family: Helvetica;
  letter-spacing: 0.5px; // improve eval readability
`;
