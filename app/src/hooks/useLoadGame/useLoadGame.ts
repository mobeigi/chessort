import { useCallback, useState } from 'react';
import { useGameContext } from '../useGameContext';
import { getNewRandomGame, getGameByGameId } from '../../services/chessortServer/api';
import { GameApiResponse } from '../../services/chessortServer';

export const useLoadGame = () => {
  const { dispatch } = useGameContext();
  const [game, setGame] = useState<GameApiResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const loadGame = useCallback(
    async (gameId?: string) => {
      setLoading(true);
      setError(false);

      dispatch({ type: 'SET_LOADING_GAME', payload: true });

      try {
        // Get game by id or a random game otherwise
        const game = gameId ? await getGameByGameId(gameId) : await getNewRandomGame();

        // Response was successful
        dispatch({
          type: 'NEW_GAME',
          payload: game,
        });

        setGame(game);

        dispatch({ type: 'SET_LOADING_GAME', payload: false });
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return { loadGame, game, loading, error };
};
