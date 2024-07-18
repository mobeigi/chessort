import LogoSvg from '/logo.svg'
import { Header, Logo, Title, Game, ChessBoardWrapper, Panel, Footer } from './styled'
import ChessBoard from './ChessBoard'

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
        <Panel>PANEL</Panel>
      </Game>

      <Footer>FOOTER</Footer>
    </>
  )
}

export default App
