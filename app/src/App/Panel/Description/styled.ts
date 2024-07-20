import { styled } from 'styled-components';
import { Difficulty } from '../../../context/types';

export const DifficultyLine = styled.div`
  display: flex;
  gap: 0.5em;
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
  text-shadow: 0 0 10px #000;
  background-color: ${({ $difficulty }) => getBackgroundColor($difficulty)};
  white-space: nowrap;
`;
