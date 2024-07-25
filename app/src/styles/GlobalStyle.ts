import { createGlobalStyle } from 'styled-components';
import 'boxicons/css/boxicons.min.css';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  /* Base font size */
  html {
    font-size: 16px;
  }

  /* Adjust font size for different screen sizes */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet.maxWidth}px) {
    html {
      font-size: 15px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    html {
      font-size: 14px;
    }
  }

  /* Root styling */
  #root {
    background-color: ${({ theme }) => theme.colors.background};
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.backgroundBlend});
    color: ${({ theme }) => theme.colors.text.base};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.text.link};
    text-decoration: inherit;
  }
  a:hover {
    color: ${({ theme }) => theme.colors.text.linkHighlight};
  }

  /* Buttons */
  button {
    border-radius: 4px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.status.primary.base};
    transition:
        border-color 0.25s,
        background-color 0.3s ease,
        transform 0.2s ease;
  }
  
  button:hover {
    background-color: ${({ theme }) => theme.colors.status.primary.baseHighlight};
  }

  button:active {
    background-color: ${({ theme }) => theme.colors.status.primary.base};
  }

  button:focus,
  button:focus-visible {
    box-shadow: 0 0 0 0.25em rgba(43, 118, 163, 0.5); /* #2b76a3 */
  }

  button:disabled {
    background-color: ${({ theme }) => theme.colors.status.disabled.base};
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.status.disabled.baseHighlight};
    border-color: ${({ theme }) => theme.colors.status.disabled.accent};
  }

  button:disabled:hover {
    background-color: ${({ theme }) => theme.colors.status.disabled.base};
  }
`;

export default GlobalStyle;
