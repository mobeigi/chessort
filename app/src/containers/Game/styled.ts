import styled from 'styled-components';
import { hexToRgba } from '../../utils/themeUtils';

export const GameWrapper = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5em;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    flex-direction: column;
  }
`;

export const ChessBoardWrapper = styled.section`
  display: flex;

  /* Hack below to ensure chessboard looks good on any viewport.
   * This ensures the board will fit on the screen even on weird viewports that don't have a squarish aspect ratio.
   * TODO: Its possible this can be refactored now to remove the calc() calls and generally be improved.
  */
  width: calc(min(65vw, 65vh));
  height: calc(
    min(65vw, 65vh)
  ); // We also set height explicitly to the same 'width' to allow other styling to fit child element (i.e. borders)

  min-width: 300px;
  min-height: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    width: 80vw;
    height: 80vw;
  }
`;

export const PanelWrapper = styled.section`
  display: flex;
  width: calc(min(30vw, 30vh));
  height: calc(min(65vw, 65vh));

  max-width: 100%; /* Avoid overflow */

  min-width: 230px; // Or else panel doesn't quite fit everything with high vw/low vh viewports
  min-height: 300px;

  border: 1px solid ${({ theme }) => hexToRgba(theme.colors.container.accent, 0.2)};

  border-radius: 0em 0.4em 0.4em 0em; // TODO: not showing, needs to be moved, dont use overflow hidden

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    width: 80vw;
    height: auto;
  }
`;
