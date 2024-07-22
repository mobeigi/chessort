import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  display: flex;
  min-height: 50px;

  justify-content: center;
  align-items: center;

  font-size: 0.8em;
  font-family: Verdana;
`;

export const CreatedByWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 calc(max(65vmin, 200px)); /* Matches styling on board / panel. TODO: commonise this */
  display: flex;
  line-height: 1.2em;

  a {
    text-decoration: none;
  }
`;

export const PieceWrapper = styled.span`
  font-size: 1.3em;
  font-family: 'Noto Sans Symbols 2', sans-serif;
  margin-bottom: -0.35em; /* Fine-tune alignment between both fonts */
  margin-left: 0.2em;
  line-height: 1.2em;
`;

export const CopyrightDisclaimer = styled.div`
  display: flex;
  flex: 0 0 calc(30vmin); /* Matches styling on board / panel. TODO: commonise this */
  justify-content: center;
  align-items: center;
  font-size: 0.85em;
`;
