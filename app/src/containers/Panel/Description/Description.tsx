import { Link } from 'react-router-dom';
import { PuzzleLine, GameId, DifficultyLine, DifficultyLozenge } from './styled';
import { DescriptionProps } from './types';

export const Description = ({ gameId, difficulty }: DescriptionProps) => {
  const puzzleLink = `/game/${gameId}`;
  return (
    <>
      <PuzzleLine>
        <strong>Game Id: </strong>
        <GameId>
          <Link to={puzzleLink}>#{gameId}</Link>
        </GameId>
      </PuzzleLine>
      <DifficultyLine>
        <strong>Difficulty: </strong>
        <DifficultyLozenge $difficulty={difficulty}>{difficulty}</DifficultyLozenge>
      </DifficultyLine>
    </>
  );
};
