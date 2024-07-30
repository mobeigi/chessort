import styled from 'styled-components';
import { hexToRgba } from '../../utils/themeUtils';
import { SquareCss, ComplementPanelCss } from '../../styles/splitViews';

export const GameWrapper = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5em;

  // Mobile vertical view
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    flex-direction: column;
  }
`;

export const ChessBoardWrapper = styled.section`
  ${SquareCss({ percent: 65, totalPercent: 95, minWidthPx: 400, minHeightPx: 400 })}

  // Mobile vertical view
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    width: 80vw;
    height: 80vw;

    min-width: 300px; // Match PanelWrapper height/width in this view
    min-height: 300px;
  }
`;

export const PanelWrapper = styled.section`
  ${ComplementPanelCss({ percent: 30, totalPercent: 95, minWidthPx: 230, minHeightPx: 400 })}

  // Slight border for panel
  border: 1px solid ${({ theme }) => hexToRgba(theme.colors.container.accent, 0.2)};
  border-radius: 0.4em;

  // Mobile vertical view
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    width: 80vw;
    height: auto;

    min-width: 300px; // Match ChessBoardWrapper height/width in this view
    min-height: auto;
  }
`;
