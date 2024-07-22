import { DifficultyLine, DifficultyLozenge } from './styled';
import { DescriptionProps } from './types';

export const Description = ({ difficulty }: DescriptionProps) => {
  return (
    <>
      <p>
        <strong>Puzzle: </strong> TODO
      </p>
      <DifficultyLine>
        <strong>Difficulty: </strong>
        <DifficultyLozenge $difficulty={difficulty}>{difficulty}</DifficultyLozenge>
      </DifficultyLine>
    </>
  );
};
