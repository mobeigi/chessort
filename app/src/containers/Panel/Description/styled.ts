import { styled } from 'styled-components';
import { Difficulty } from '../../../types/difficulty';

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`;

export const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const GameId = styled.span`
  font-family: 'Roboto Mono', monospace;
`;

export const HitsContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
`;

export const JoystickIconAdjustmentWrapper = styled.span`
  display: flex;
  font-size: 1.4em;
`;

export const ChessBoardAdjustmentWrapper = styled.span`
  display: flex;
  font-size: 1em;
  padding-right: 0.08em;
`;

export const HitCounter = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.1em;
`;

interface DifficultyWrapperProps {
  $difficulty: Difficulty;
}

const getBackgroundColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.BEGINNER:
      return '#4caf50'; // Green
    case Difficulty.EASY:
      return '#8bc34a'; // Light green
    case Difficulty.MEDIUM:
      return '#ffeb3b'; // Yellow
    case Difficulty.HARD:
      return '#ff9800'; // Orange
    case Difficulty.MASTER:
      return '#f44336'; // Red
    default:
      return '#0052cc'; // Fallback
  }
};

export const DifficultyLozenge = styled.span<DifficultyWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.1em 0.3em;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #ececec;
  background-color: ${({ $difficulty }) => getBackgroundColor($difficulty)};
  white-space: nowrap;
`;
