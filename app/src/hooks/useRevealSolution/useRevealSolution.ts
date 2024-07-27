import { useState, useCallback } from 'react';
import { useGameContext } from '../useGameContext';
import { getGameSolution } from '../../services/chessortServer/api';
import { SolutionApiResponse } from '../../services/chessortServer';

export const useRevealSolution = () => {
  const { state, dispatch } = useGameContext();
  const [solution, setSolution] = useState<SolutionApiResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const revealSolution = useCallback(async () => {
    setLoading(true);
    setError(false);

    dispatch({ type: 'SET_LOADING_SOLUTION', payload: true });

    try {
      const solution = await getGameSolution(
        state.gameDetails.fen,
        state.moveDetails.map((moveDetail) => moveDetail.uciMove),
      );

      // Response was successful
      dispatch({
        type: 'UPSERT_SOLUTION',
        payload: solution,
      });

      setSolution(solution);

      dispatch({ type: 'REVEAL_SOLUTION' }); // also sets loading solution to false
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      dispatch({ type: 'SET_LOADING_SOLUTION', payload: false });
    }
  }, [dispatch, state.gameDetails.fen, state.moveDetails]);

  return { revealSolution, solution, loading, error };
};
