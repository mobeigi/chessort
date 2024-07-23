import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from './useGameContext';
import { getNewRandomGame, getGameByGameId } from '../services/chessortServer/api';

export const useLoadGame = () => {
  const { state, dispatch } = useGameContext();
  const navigate = useNavigate();

  const loadGame = useCallback(
    async (gameId?: string) => {
      dispatch({ type: 'SET_LOADING_GAME', payload: true });

      let data;
      try {
        if (gameId) {
          // Load specific game by gameId
          data = await getGameByGameId(gameId);
        } else {
          // Load random game
          data = await getNewRandomGame();
        }
      } catch (error) {
        // TOOO: need to expose error, handle in UI properly
        console.error('Error fetching new game data:', error);
      } finally {
        if (data !== undefined) {
          dispatch({
            type: 'NEW_GAME',
            payload: data,
          });

          // Populate browser navigation history
          navigate(`/puzzle/${data.gameId}`);
        }

        dispatch({ type: 'SET_LOADING_GAME', payload: false });
      }
    },
    [dispatch, navigate],
  );

  return { loadGame, isLoadingGame: state.isLoadingGame };
};
