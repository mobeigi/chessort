import { styled } from 'styled-components'

export const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: center
`
export const Game = styled.section`
  display: flex;
  gap: 1em;
`

export const ChessBoard = styled.section`
  flex: 6; /* 60% of the container */
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid #FFF;
`

export const Panel = styled.section`
  flex: 4; /* 40% of the container */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;

  border: solid #FFF;
`
