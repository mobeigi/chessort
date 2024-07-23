import styled from 'styled-components';

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
   * This is because the board's height/width is set based on parent elements width (and we cant control this).
   * Therefore, we set the width to either a percentage of either the vw or vh depending on which is smaller.
   * This ensures the board will fit on the screen even on weird viewports that don't have a squarish aspect ratio. 
  */
  width: calc(min(65vw, 65vh));
  height: calc(
    min(65vw, 65vh)
  ); // We also set height explicitly to the same 'width' to allow other styling to fit child element (i.e. borders)

  min-width: 300px; /* A value for min-width is always required to allow shrinking on window resize in a flexbox */
  min-height: 300px;

  border: 1px solid #ccc;
  box-sizing: border-box;

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

  border: 1px solid #ccc;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    width: 80vw;
    height: auto;
  }
`;
