import LogoSvg from '/logo.svg'
import { Header, Logo, Title, Game, ChessBoardWrapper, PanelWrapper, Footer } from './styled'
import ChessBoard from './ChessBoard'
import Panel from './Panel'

const App = () => {
  return (
    <>
      <Header>
        <Logo src={LogoSvg} alt="Chessort Logo" />
        <Title>Chessort</Title>
      </Header>

      <Game>
        <ChessBoardWrapper>
          <ChessBoard />
        </ChessBoardWrapper>
        <PanelWrapper>
          <Panel />
        </PanelWrapper>
      </Game>

      <Footer>FOOTER</Footer>
    </>
  )
}

export default App
