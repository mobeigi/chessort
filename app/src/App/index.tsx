import LogoSvg from '/logo.svg';
import { Header, Logo, Title, GameWrapper, ChessBoardWrapper, PanelWrapper, Footer } from './styled';
import ChessBoard from './ChessBoard';
import Panel from './Panel';
import { GameProvider } from '../context/gameContext';

const App = () => {
  return (
    <>
      <Header>
        <Logo src={LogoSvg} alt="Chessort Logo" />
        <Title>Chessort</Title>
      </Header>

      <GameWrapper>
        <GameProvider>
          <ChessBoardWrapper>
            <ChessBoard />
          </ChessBoardWrapper>
          <PanelWrapper>
            <Panel />
          </PanelWrapper>
        </GameProvider>
      </GameWrapper>

      <Footer>FOOTER</Footer>
    </>
  );
};

export default App;
