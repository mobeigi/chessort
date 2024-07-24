import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import NotFoundPage from './NotFoundPage';
import theme from '../../styles/theme';
import { THEME_MODE } from '../../types/theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../../styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../../context/gameContext';
import Game from '../Game';

export const App = () => {
  const [isDarkMode] = useState(false);
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors.light;
  const mode: THEME_MODE = isDarkMode ? 'dark' : 'light';

  return (
    <>
      <Router>
        <ThemeProvider theme={{ ...theme, colors: currentTheme, mode }}>
          <GlobalStyle />
          <GameProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="/puzzle/:gameId" element={<Game />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </GameProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};
