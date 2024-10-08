import styled from 'styled-components';
import { Color } from '../../../types/color';
import { getBaseColor, getOverlayColor, getTextShadowColor } from './utils';
import { SvgIcon } from '../../../styles/icon';

interface CardContainerProps {
  $isDragging: boolean;
  $isPreviewed: boolean;
  $revealed: boolean;
}

export const CardContainer = styled.div.attrs<CardContainerProps>(({ $isDragging, style }) => ({
  style: {
    ...style,
    zIndex: $isDragging ? 999 : undefined,
    position: $isDragging ? 'relative' : undefined,
  },
}))<CardContainerProps>`
  display: flex;
  background-color: ${({ theme }) => theme.colors.chessBoardDarkSquare};
  color: #323232;
  border: 0.15em solid transparent;
  border-radius: 0.4em;
  align-items: center;

  ${({ $isPreviewed, $isDragging, theme }) =>
    ($isPreviewed || $isDragging) &&
    `
      background-color: #d4a27c;
      border: 0.15em solid ${theme.mode === 'dark' ? '#ffe3c7' : '#946b4c'};
      box-shadow: 0 0 5px 0px ${theme.mode === 'dark' ? 'rgba(255, 227, 199, 0.5)' : 'rgba(121, 77, 44, 0.5)'}; /* Above border color at 0.5 opacity */
    `}

  ${({ $revealed }) => ($revealed ? `cursor: auto` : `cursor: grab`)};

  /* Tweak padding for different viewports we support */
  padding: 0.6em 0.4em;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet.maxWidth}px),
    (max-height: ${({ theme }) => theme.breakpoints.tablet.maxHeight}px) {
    padding: 0.4em 0.4em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px),
    (max-height: ${({ theme }) => theme.breakpoints.mobile.maxHeight}px) {
    padding: 0.2em 0.8em;
  }
`;

export const CurrentRankWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

const BaseDigitGrid = styled.span`
  display: grid;
  justify-items: center;
  align-items: center;
  width: 1em;

  /* to support same height regardless of how many items in grid, at most we'll have 2 rows */
  height: 2em;

  /* Ensure the text inside grid fits nicely */
  font-size: 1em;
  line-height: 1em;
`;

export const OneDigitGrid = styled(BaseDigitGrid)``;

export const TwoDigitGrid = styled(BaseDigitGrid)`
  grid-template-columns: repeat(1, 1fr);
`;

export const ThreeDigitGrid = styled(BaseDigitGrid)`
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;

  :nth-child(1) {
    grid-column: span 2;
  }
`;
export const FourDigitGrid = styled(BaseDigitGrid)`
  grid-template-columns: repeat(2, 1fr);
`;

export const StatusIconWrapper = styled.span`
  display: flex;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.25));

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CurrentRankNumberWrapper = styled.span`
  font-weight: bold;
`;

export const SanMoveWrapper = styled.span`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  line-height: 1.2em;
  gap: 0.2em;
  padding-left: 0.4em;
`;

export const MovePieceIcon = styled(SvgIcon)`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  font-size: 2em;
`;

interface SanMovePieceProps {
  $color: Color;
}

export const MoveNotation = styled.span<SanMovePieceProps>`
  font-weight: bold;
  font-family: 'Roboto Mono', monospace;
  line-height: 1.2em;
  color: ${(props) => getBaseColor(props.$color)};
  text-shadow: 0px 0px 4px ${(props) => getTextShadowColor(props.$color)};
`;

export const EngineRankWrapper = styled.span`
  display: flex;
  margin-right: 0.3em;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.25)); // Need to add the drop shadow here so it affects clip-path in child

  // Highlight effect on hover
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

interface EngineRankProps {
  $rank: number;
}

export const EngineRank = styled.span<EngineRankProps>`
  display: flex;
  position: relative;
  width: 24px;
  height: 24px;
  font-size: 0.75em;
  font-weight: 600;
  padding: 0.2em;

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
    color: #9f750e;
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
    color: #7a4518;
  `}

  ${(props) =>
    props.$rank > 3 &&
    `
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background-color: ${getBaseColor(Color.Neutral)};
    color: ${getOverlayColor(Color.Neutral)};
  `}
`;

interface EngineEvalWrapperProps {
  $advantageFor: Color;
}

export const EngineEvalWrapper = styled.span<EngineEvalWrapperProps>`
  display: flex;
  min-width: 3.2em;
  justify-content: center;
  background-color: ${(props) => getBaseColor(props.$advantageFor)};
  color: ${(props) => getOverlayColor(props.$advantageFor)};
  border-radius: 0.2em;
  padding: 0.2em 0.3em;
  box-sizing: border-box;
  font-size: 0.8em;
  font-weight: bold;
  letter-spacing: 0.25px; // improve eval readability
`;
