import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/index.tsx';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // TODO: Reenable strict mode once this is solved
  // https://github.com/Clariity/react-chessboard/issues/119
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
