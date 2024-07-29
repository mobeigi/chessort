import Header from './Header';
import Footer from './Footer';
import NotFoundPage from './NotFoundPage';
import theme from '../../styles/theme';
import { ThemeMode } from '../../types/theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from '../../styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../../context/gameContext';
import Game from '../Game';
import { UserPreferencesProvider } from '../../context/userPreferencesContext';
import useUserPreferences from '../../hooks/useUserPreferences';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import GlobalTooltips from './GlobalTooltip';

Modal.setAppElement('#root');

const AppContainer = () => {
  const { mode } = useUserPreferences();
  const currentTheme = mode === ThemeMode.Dark ? theme.colors.dark : theme.colors.light;

  // Provide current theme and mode for convenience
  const extraThemeArguments = { colors: currentTheme, mode };

  return (
    <>
      <StyledThemeProvider theme={{ ...theme, ...extraThemeArguments }}>
        <GlobalStyle />
        <GlobalTooltips />
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </StyledThemeProvider>
    </>
  );
};

export const App = () => (
  <>
    <Router>
      <UserPreferencesProvider>
        <GameProvider>
          <AppContainer />
        </GameProvider>
      </UserPreferencesProvider>
    </Router>
  </>
);
