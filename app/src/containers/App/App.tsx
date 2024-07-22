import LogoSvg from '/logo.svg';
import { Header, Logo, Title } from './styled';
import Footer from './Footer';
import GlobalStyle from '../../styles/GlobalStyle';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from '../Game';

export const App = () => {
  return (
    <>
      <Router>
        <GlobalStyle />
        <Header>
          <Logo src={LogoSvg} alt="Chessort Logo" />
          <Title>Chessort</Title>
        </Header>

        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/puzzle/:gameId" element={<Game />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
};
