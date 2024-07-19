import { Advantage } from './types';

/**
 * Evaluates the given chess engine evaluation string and determines the advantage.
 * 
 * @param evaluation - The evaluation string from the chess engine.
 *                      This can be in the form of a centipawn evaluation (e.g., "+265", "-462")
 *                      or a mate evaluation (e.g., "#1", "#-1").
 * @returns Advantage - Returns Advantage.White if white is winning,
 *                      Advantage.Black if black is winning,
 *                      or Advantage.Neutral if the position is balanced.
 */
export const evaluateAdvantage = (evaluation: string): Advantage => {
  if (evaluation.startsWith('#')) {
    const mateValue = parseInt(evaluation.slice(1));
    return mateValue > 0 ? Advantage.White : Advantage.Black;
  }

  const centipawnValue = parseFloat(evaluation);
  if (centipawnValue > 0) {
    return Advantage.White;
  } else if (centipawnValue < 0) {
    return Advantage.Black;
  } else {
    return Advantage.Neutral;
  }
};

/**
 * Formats the given chess engine evaluation string to a more readable format.
 * 
 * @param evaluation - The evaluation string from the chess engine.
 *                      This can be in the form of a centipawn evaluation (e.g., "+265", "-462")
 *                      or a mate evaluation (e.g., "#1", "#-1").
 * @returns string - Returns the formatted evaluation string. Mate evaluations are prefixed
 *                   with "+" or "-" (e.g., "+M1", "-M1"). Centipawn evaluations are converted
 *                   to decimal form and prefixed with "+" or "-" (e.g., "+2.65", "-4.62").
 *                   If the evaluation is "0.00", an empty string is returned.
 */
export const formatEvaluation = (evaluation: string): string => {
  if (evaluation.startsWith('#')) {
    const mateValue = parseInt(evaluation.slice(1));
    return `${mateValue > 0 ? '+' : '-'}M${Math.abs(mateValue)}`;
  }

  const centipawnValue = parseFloat(evaluation);
  const sign = determineSign(centipawnValue);
  return `${sign}${Math.abs(centipawnValue / 100).toFixed(2)}`;
};

const determineSign = (centipawnValue: number): string => {
  if (centipawnValue === 0) {
    return '';
  }
  return centipawnValue > 0 ? '+' : '-';
}
