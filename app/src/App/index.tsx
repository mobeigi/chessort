import Logo from '/logo.svg'
import { HeaderWrapper } from './styled'

function App() {
  return (
    <>
      <HeaderWrapper id="header">
        <img src={Logo} height="100" alt="Chessort Logo" />
        <h1>Chessort</h1>
      </HeaderWrapper>

      <div>
        <p>TODO!!</p>
      </div>
    </>
  )
}

export default App
