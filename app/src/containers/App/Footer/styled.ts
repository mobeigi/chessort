import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: row;

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

export const CreatedByWrapper = styled.div`
  display: flex;

  /* Matches styling on board / panel. TODO: commonise this */
  width: calc(min(65vw, 65vh));
  min-width: 300px;

  justify-content: center;
  align-items: center;

  text-wrap: nowrap;
  a {
    text-decoration: none;
  }
`;

export const SocialContainer = styled.div`
  display: flex;
  gap: 0.2em;

  /* Matches styling on board / panel. TODO: commonise this */
  width: calc(min(30vw, 30vh));
  max-width: 100%; /* Avoid overflow */
  min-width: calc((300px / 65) * 30);

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
