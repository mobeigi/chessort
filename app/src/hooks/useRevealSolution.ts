import { useCallback } from 'react';
import { useGameContext } from './useGameContext';
import { getGameSolution } from '../services/chessortServer/api';

export const useRevealSolution = () => {
  const { state, dispatch } = useGameContext();

  const revealSolution = useCallback(async () => {
    dispatch({ type: 'SET_LOADING_SOLUTION', payload: true });

    let data;
    try {
      data = await getGameSolution(
        state.gameDetails.fen,
        state.moveDetails.map((moveDetail) => moveDetail.uciMove),
      );
      dispatch({
        type: 'UPSERT_SOLUTION',
        payload: data,
      });
    } catch (error) {
      // TOOO: need to expose error, handle in UI properly
      console.error('Error getting game solution data:', error);
    } finally {
      if (data !== undefined) {
        dispatch({ type: 'UNPREVIEW_MOVE' });
        dispatch({ type: 'REVEAL_SOLUTION' }); // also sets loading solution to false
      }
    }
  }, [dispatch, state.gameDetails.fen, state.moveDetails]);

  return { revealSolution };
};
