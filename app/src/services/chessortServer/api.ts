import { fetchApi } from '../common/utils';
import { BASE_API_URL } from './constants';

export const getNewRandomGame = () => fetchApi(`${BASE_API_URL}/game/random`);

export const getGameByGameId = (gameId: string) => fetchApi(`${BASE_API_URL}/game/${gameId}`);

export const getGameSolution = (fen: string, uciMoves: string[]) => {
  const data = {
    fen,
    uciMoves,
  };
  return fetchApi(`${BASE_API_URL}/solution`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
