import { GameApiResponse } from '../../services/chessortServer/types';

export interface UseLoadGameProps {
  onSuccess?: (game: GameApiResponse) => void;
}
