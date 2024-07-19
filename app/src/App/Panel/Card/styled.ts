import styled from 'styled-components';
import { Color } from './types';
import { getBaseColor, getOverlayColor } from './utils';

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
  border: 2px solid #242424;
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
`;

export const StatusIconWrapper = styled.span`
  display: flex;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CurrentRankNumber = styled.span`
  font-weight: bold;
`;

export const SanMoveWrapper = styled.span`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  line-height: 1.2em;
  gap: 0.2em;
  padding-left: 0.6em;
`;

interface SanMovePieceProps {
  $color: Color;
}

export const MoveChessPiece = styled.span<SanMovePieceProps>`
  font-size: 1.3em;
  font-family: 'Noto Sans Symbols 2', sans-serif;
  margin-bottom: -0.35em; /* Fine-tune alignment between both fonts */
  line-height: 1.2em;
  color: ${(props) => getBaseColor(props.$color)};
  text-shadow: 0px 0px 4px ${(props) => getOverlayColor(props.$color)};
`;

export const MoveNotation = styled.span<SanMovePieceProps>`
  font-weight: bold;
  font-family: 'Roboto Mono', monospace;
  line-height: 1.2em;
  color: ${(props) => getBaseColor(props.$color)};
  text-shadow: 0px 0px 4px ${(props) => getOverlayColor(props.$color)};
`;

export const EngineRankWrapper = styled.span`
  display: flex;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.25)); // Need to add the drop shadow here so it affects clip-path in child
`;

interface EngineRankProps {
  $rank: number;
}

export const EngineRank = styled.span<EngineRankProps>`
  display: inline-flex;
  width: 24px;
  height: 24px;
  font-size: 0.7em;
  font-weight: 600;
  opacity: 0.8;
  padding: 2px;

  &::before {
    content: '${(props) => props.$rank}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ${(props) =>
    props.$rank <= 3 &&
    `
    clip-path: polygon(50% 0%, 63% 33%, 98% 35%, 68% 57%, 79% 91%, 50% 72%, 21% 91%, 32% 57%, 2% 35%, 37% 33%);
  `}

  ${(props) =>
    props.$rank === 1 &&
    `
    background-color: gold;
    color: #B8860B;
  `}

  ${(props) =>
    props.$rank === 2 &&
    `
    background-color: silver;
    color: #4F4F4F;
  `}

  ${(props) =>
    props.$rank === 3 &&
    `
    background-color: #cd7f32;
    color: #964e12;
  `}

  ${(props) =>
    props.$rank > 3 &&
    `
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background-color: #808080;
    color: #ffffeb;
  `}
`;

interface EngineEvalWrapperProps {
  $advantageFor: Color;
}

export const EngineEvalWrapper = styled.span<EngineEvalWrapperProps>`
  display: flex;
  width: 3em;
  justify-content: center;
  background-color: ${(props) => getBaseColor(props.$advantageFor)};
  color: ${(props) => getOverlayColor(props.$advantageFor)};
  border-radius: 0.2em;
  padding: 0.2em 0.3em;
  font-size: 0.8em;
  font-weight: bold;
  font-family: Helvetica;
  letter-spacing: 0.5px; // improve eval readability
`;
