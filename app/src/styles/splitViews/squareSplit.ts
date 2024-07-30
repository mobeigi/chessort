import { css } from 'styled-components';
import type { SquareSplitProps } from './types';

/*
 * The styling below ensures a square primary component alongside a panel looks good on any viewport.
 * This includes viewports with a non-squarish viewport.
 * The min width and min height are used to enforce reasonable minimums.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SquareCss = ({ percent: leftPercent, totalPercent, minWidthPx, minHeightPx }: SquareSplitProps) => css`
  display: flex;

  // Create square left side
  width: calc(min(${leftPercent}vw, ${leftPercent}vh));
  height: calc(min(${leftPercent}vw, ${leftPercent}vh));

  // For high vw/low vh viewports
  min-width: ${minWidthPx}px;
  min-height: ${minHeightPx}px;
`;

export const ComplementPanelCss = ({
  percent: rightPercent,
  totalPercent,
  minWidthPx,
  minHeightPx,
}: SquareSplitProps) => css`
  display: flex;
  width: calc(min(${rightPercent}vw, ${rightPercent}vh));
  height: calc(min(${totalPercent - rightPercent}vw, ${totalPercent - rightPercent}vh));

  max-width: 100%; /* Avoid overflow */

  // For high vw/low vh viewports
  min-width: ${minWidthPx}px;
  min-height: ${minHeightPx}px;
`;
