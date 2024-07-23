import { useCallback } from 'react';
import { useGameContext } from '../useGameContext';
import { getGameSolution } from '../../services/chessortServer/api';
import { UseRevealSolutionProps } from './types';

export const useRevealSolution = ({ onSuccess }: UseRevealSolutionProps = {}) => {
  const { state, dispatch } = useGameContext();

  const revealSolution = useCallback(async () => {
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

      dispatch({ type: 'REVEAL_SOLUTION' }); // also sets loading solution to false

      if (onSuccess) {
        onSuccess(solution);
      }
    } catch (error) {
      // TOOO: need to expose error, handle in UI properly
      console.error('Error getting game solution data:', error);
    }
  }, [dispatch, onSuccess, state.gameDetails.fen, state.moveDetails]);

  return { revealSolution };
};
