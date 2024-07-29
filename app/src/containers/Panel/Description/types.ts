import { Difficulty } from '../../../types/difficulty';

export interface DescriptionProps {
  gameId: string;
  difficulty: Difficulty;
  positionHits: number;
  gameHits: number;
}
