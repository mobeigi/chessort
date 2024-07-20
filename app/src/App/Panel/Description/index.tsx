import { useGameContext } from '../../../context/gameContext';
import { DifficultyLine, DifficultyLozenge } from './styled';

export const Description = () => {
  const { state } = useGameContext();

  return (
    <>
      <p>
        <strong>Puzzle: </strong> TODO
      </p>
      <DifficultyLine>
        <strong>Difficulty: </strong>
        <DifficultyLozenge $difficulty={state.gameDetails.difficulty}>{state.gameDetails.difficulty}</DifficultyLozenge>
      </DifficultyLine>
    </>
  );
};
