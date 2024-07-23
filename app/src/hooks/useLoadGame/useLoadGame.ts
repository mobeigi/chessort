import { useCallback } from 'react';
import { useGameContext } from '../useGameContext';
import { getNewRandomGame, getGameByGameId } from '../../services/chessortServer/api';
import { UseLoadGameProps } from './types';

export const useLoadGame = ({ onSuccess }: UseLoadGameProps = {}) => {
  const { state, dispatch } = useGameContext();

  const loadGame = useCallback(
    async (gameId?: string) => {
      dispatch({ type: 'SET_LOADING_GAME', payload: true });

      try {
        // Get game by id or a random game otherwise
        const game = gameId ? await getGameByGameId(gameId) : await getNewRandomGame();

        // Response was successful
        dispatch({
          type: 'NEW_GAME',
          payload: game,
        });

        if (onSuccess) {
          onSuccess(game);
        }

        dispatch({ type: 'SET_LOADING_GAME', payload: false });
      } catch (error) {
        // TOOO: need to expose error, handle in UI properly
        console.error('Error fetching new game data:', error);
      }
    },
    [dispatch, onSuccess],
  );

  return { loadGame, isLoadingGame: state.isLoadingGame };
};
