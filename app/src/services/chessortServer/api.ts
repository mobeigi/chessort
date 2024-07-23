import { fetchApi } from '../common/utils';
import { BASE_API_URL } from './constants';
import { GameApiResponse, SolutionApiResponse } from './types';

export const getNewRandomGame = () => fetchApi(`${BASE_API_URL}/game/random`) as Promise<GameApiResponse>;

export const getGameByGameId = (gameId: string) =>
  fetchApi(`${BASE_API_URL}/game/${gameId}`) as Promise<GameApiResponse>;

export const getGameSolution = (fen: string, uciMoves: string[]) => {
  const data = {
    fen,
    uciMoves,
  };
  return fetchApi(`${BASE_API_URL}/solution`, {
    method: 'POST',
    body: JSON.stringify(data),
  }) as Promise<SolutionApiResponse>;
};
