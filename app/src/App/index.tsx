import Logo from '/logo.svg'
import { Header, Game, ChessBoard, Panel } from './styled'

function App() {
  return (
    <>
      <Header>
        <img src={Logo} height="100" alt="Chessort Logo" />
        <h1>Chessort</h1>
      </Header>

      <Game>
        <ChessBoard>TODO</ChessBoard>
        <Panel>TODO</Panel>
      </Game>
    </>
  )
}

export default App
