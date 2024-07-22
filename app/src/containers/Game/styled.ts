import styled from 'styled-components';

export const GameWrapper = styled.section`
  display: flex;
  justify-content: center;
  gap: 0.5em;
`;

export const ChessBoardWrapper = styled.section`
  display: flex;
  /* Hack below to ensure chessboard looks good on any viewport.
   * This is because the board's height/width is set based on parent elements width.
   * We set width/height to square based on vmin with an enforced minimum pixel amount.
  */
  flex: 0 0 calc(max(65vmin, 200px));
  height: calc(max(65vmin, 200px));
  border: 1px solid #ccc;
  box-sizing: border-box;
  min-width: 0; /* Allow chess board to shrink on window resize */
`;

export const PanelWrapper = styled.section`
  display: flex;
  flex: 0 0 calc(30vmin); /* 30% of the smaller viewport dimension */
  border: 1px solid #ccc;
`;
