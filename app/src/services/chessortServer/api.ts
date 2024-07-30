import { fetchApi } from '../common/utils';
import { API_BASE_URL } from './constants';
import { GameApiResponse, SolutionApiResponse } from './types';

export const getNewRandomGame = () => fetchApi(`${API_BASE_URL}/game/random`) as Promise<GameApiResponse>;

export const getGameByGameId = (gameId: string) =>
  fetchApi(`${API_BASE_URL}/game/${gameId}`) as Promise<GameApiResponse>;

export const getGameSolution = (gameId: string) => {
  const data = {
    gameId,
  };
  return fetchApi(`${API_BASE_URL}/solution`, {
    method: 'POST',
    body: JSON.stringify(data),
  }) as Promise<SolutionApiResponse>;
};
