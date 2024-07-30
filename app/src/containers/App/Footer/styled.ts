import styled from 'styled-components';
import { SquareCss, ComplementPanelCss } from '../../../styles/splitViews/squareSplit';

export const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;
  gap: 0.5em;

  margin-top: 1em;
  margin-bottom: 0.5em;
  justify-content: center;
  align-items: center;

  font-family: 'Roboto Mono', monospace;
  font-size: 0.8em;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    flex-direction: column;
    gap: 0.5em;
  }
`;

export const CreatedByWrapper = styled.section`
  // Mimic the game dimensions but overwrite the height
  ${SquareCss({ percent: 65, totalPercent: 95, minWidthPx: 400, minHeightPx: 0 })}
  height: auto;

  justify-content: center;
  align-items: center;

  text-wrap: nowrap;
  a {
    text-decoration: none;
  }
`;

export const SocialContainer = styled.section`
  // Mimic the game dimensions but overwrite the height
  ${ComplementPanelCss({ percent: 30, totalPercent: 95, minWidthPx: 230, minHeightPx: 0 })}
  height: auto;

  gap: 0.2em;

  justify-content: center;
  align-items: center;
`;

export const IconWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  color: ${({ theme }) => theme.colors.text.base};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.baseHighlight};
  }

  &:active {
    transform: scale(0.95);
  }
`;
