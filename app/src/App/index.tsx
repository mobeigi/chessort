import Logo from '/logo.svg'
import { Header, Title, Game, ChessBoardWrapper, Panel, Footer } from './styled'
import ChessBoard from './ChessBoard'

const App = () => {
  return (
    <>
      <Header>
        <img src={Logo} height="100em" alt="Chessort Logo" />
        <Title>Chessort</Title>
      </Header>

      <Game>
        <ChessBoardWrapper>
          TODO!
            {/* <ChessBoard /> */}
        </ChessBoardWrapper>
        <Panel>PANEL</Panel>
      </Game>

      <Footer>FOOTER</Footer>
    </>
  )
}

export default App
