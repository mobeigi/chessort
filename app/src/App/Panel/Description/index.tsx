import { useGameContext } from '../../../context/gameContext';
import { DifficultyWrapper } from './styled';

export const Description = () => {
  const { state } = useGameContext();

  return (
    <>
      <p>
        <strong>Puzzle: </strong> TODO
      </p>
      <p>
        <strong>Difficulty: </strong>
        <DifficultyWrapper difficulty={state.gameDetails.difficulty}>{state.gameDetails.difficulty}</DifficultyWrapper>
      </p>
    </>
  );
};
