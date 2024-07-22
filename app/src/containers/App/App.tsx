import LogoSvg from '/logo.svg';
import { Header, Logo, Title, GameWrapper, ChessBoardWrapper, PanelWrapper } from './styled';
import ChessBoard from '../../components/ChessBoard';
import Panel from '../Panel';
import { GameProvider } from '../../context/gameContext';
import { useGameContext } from '../../hooks/useGameContext';
import Footer from './Footer';
import GlobalStyle from '../../styles/GlobalStyle';

const ChessBoardContainer = () => {
  const { state } = useGameContext();
  return <ChessBoard fen={state.curChessJs.fen()} />;
};

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header>
        <Logo src={LogoSvg} alt="Chessort Logo" />
        <Title>Chessort</Title>
      </Header>

      <GameWrapper>
        <GameProvider>
          <ChessBoardWrapper>
            <ChessBoardContainer />
          </ChessBoardWrapper>
          <PanelWrapper>
            <Panel />
          </PanelWrapper>
        </GameProvider>
      </GameWrapper>

      <Footer />
    </>
  );
};
