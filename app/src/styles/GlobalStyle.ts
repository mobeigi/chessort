import { createGlobalStyle } from 'styled-components';

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
    background: linear-gradient(180deg, #242424, #36454f);
  }
  
  /* Links */
  a {
    color: #4e95c7;
    text-decoration: inherit;
  }
  a:hover {
    color: #5aa7cc;
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
    color: #fff;
    background-color: #2b76a3;
    transition:
        border-color 0.25s,
        background-color 0.3s ease,
        transform 0.2s ease;
  }
  
  button:hover {
    background-color: #5aa7cc;
  }

  button:active {
    background-color: #2b76a3;
  }

  button:focus,
  button:focus-visible {
    box-shadow: 0 0 0 0.25em rgba(43, 118, 163, 0.5); /* #2b76a3 */
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #666666;
    border-color: #999999;
  }

  button:disabled:hover {
    background-color: #cccccc;
  }
`;

export default GlobalStyle;
