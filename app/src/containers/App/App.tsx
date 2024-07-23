import Header from './Header';
import Footer from './Footer';
import theme from '../../styles/theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../../styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../../context/gameContext';
import Game from '../Game';

export const App = () => {
  return (
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <GameProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="/puzzle/:gameId" element={<Game />} />
            </Routes>
            <Footer />
          </GameProvider>
        </ThemeProvider>
      </Router>
    </>
  );
};
