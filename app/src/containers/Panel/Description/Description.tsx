import { Link } from 'react-router-dom';
import { Line, GameId, DifficultyLozenge, DescriptionContainer } from './styled';
import { DescriptionProps } from './types';

export const Description = ({ gameId, difficulty, positionHits, gameHits }: DescriptionProps) => {
  const puzzleLink = `/game/${gameId}`;

  return (
    <DescriptionContainer>
      <Line>
        <strong>Game:</strong>
        <GameId>
          <Link to={puzzleLink}>#{gameId}</Link>
        </GameId>
      </Line>
      <Line>
        <strong>Hits:</strong>
        <span>
          {gameHits} • {positionHits}
        </span>
      </Line>
      <Line>
        <strong>Difficulty:</strong>
        <DifficultyLozenge $difficulty={difficulty}>{difficulty}</DifficultyLozenge>
      </Line>
    </DescriptionContainer>
  );
};
