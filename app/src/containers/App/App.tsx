import Header from './Header';
import Footer from './Footer';
import NotFoundPage from './NotFoundPage';
import theme from '../../styles/theme';
import { ThemeMode } from '../../types/theme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from '../../styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GameProvider } from '../../context/gameContext';
import Game from '../Game';
import { UserPreferencesProvider } from '../../context/userPreferencesContext';
import useUserPreferences from '../../hooks/useUserPreferences';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import GlobalTooltips from './GlobalTooltip';
import ReactGA from 'react-ga4';
import StatCounter from '../../components/StatCounter';
import {
  CHESSORT_GA_TRACKING_ID,
  CHESSORT_STATCOUNTER_PROJECT,
  CHESSORT_STATCOUNTER_SECURITY,
} from '../../constants/analytics';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { APP_NAME } from '../../constants/app';

// Set modal element
Modal.setAppElement('#root');

// Init Google Analytics
ReactGA.initialize(CHESSORT_GA_TRACKING_ID, {
  gtagOptions: {
    send_page_view: false,
  },
});

const AppContainer = () => {
  const location = useLocation();
  const { mode } = useUserPreferences();
  const currentTheme = mode === ThemeMode.Dark ? theme.colors.dark : theme.colors.light;

  // Provide current theme and mode for convenience
  const extraThemeArguments = { colors: currentTheme, mode };

  // Fire pageview on every route change
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return (
    <>
      <StyledThemeProvider theme={{ ...theme, ...extraThemeArguments }}>
        <GlobalStyle />
        <GlobalTooltips />
        <StatCounter project={CHESSORT_STATCOUNTER_PROJECT} security={CHESSORT_STATCOUNTER_SECURITY} />
        <Header />
        <ToastContainer />
        <Helmet>
          <title>{APP_NAME}</title>
        </Helmet>
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
      <HelmetProvider>
        <UserPreferencesProvider>
          <GameProvider>
            <AppContainer />
          </GameProvider>
        </UserPreferencesProvider>
      </HelmetProvider>
    </Router>
  </>
);
