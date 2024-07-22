import LogoSvg from '/logo.svg';
import { Header, Logo, Title, GameWrapper, ChessBoardWrapper, PanelWrapper, Footer } from './styled';
import ChessBoard from '../../components/ChessBoard';
import Panel from '../Panel';
import { GameProvider } from '../../context/gameContext';
import { useGameContext } from '../../hooks/useGameContext';

const ChessBoardContainer = () => {
  const { state } = useGameContext();
  return <ChessBoard fen={state.curChessJs.fen()} />;
};

export const App = () => {
  return (
    <>
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

      <Footer>FOOTER</Footer>
    </>
  );
};
