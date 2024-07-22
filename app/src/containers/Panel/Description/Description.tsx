import { PuzzleLine, GameId, DifficultyLine, DifficultyLozenge } from './styled';
import { DescriptionProps } from './types';

export const Description = ({ gameId, difficulty }: DescriptionProps) => {
  const puzzleLink = `/puzzle/${gameId}`;
  return (
    <>
      <PuzzleLine>
        <strong>Puzzle: </strong>
        <GameId>
          <a href={puzzleLink}>{gameId}</a>
        </GameId>
      </PuzzleLine>
      <DifficultyLine>
        <strong>Difficulty: </strong>
        <DifficultyLozenge $difficulty={difficulty}>{difficulty}</DifficultyLozenge>
      </DifficultyLine>
    </>
  );
};
