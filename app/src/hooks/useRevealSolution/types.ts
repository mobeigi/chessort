import { SolutionApiResponse } from '../../services/chessortServer/types';

export interface UseRevealSolutionProps {
  onSuccess?: (solution: SolutionApiResponse) => void;
}
