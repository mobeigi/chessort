import LogoSvg from '/logo.svg';
import { Header, Logo, Title, GameWrapper, ChessBoardWrapper, PanelWrapper } from './styled';
import ChessBoard from '../../components/ChessBoard';
import Panel from '../Panel';
import { GameProvider } from '../../context/gameContext';
import { useGameContext } from '../../hooks/useGameContext';
import Footer from './Footer';
import GlobalStyle from '../../styles/GlobalStyle';
import { Square } from 'react-chessboard/dist/chessboard/types';

const ChessBoardContainer = () => {
  const { state } = useGameContext();

  const lastMoveFrom = state.previewedMove?.slice(0, 2) as Square;
  const lastMoveTo = state.previewedMove?.slice(2, 4) as Square;

  return <ChessBoard fen={state.curChessJs.fen()} lastMoveFrom={lastMoveFrom} lastMoveTo={lastMoveTo} />;
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
