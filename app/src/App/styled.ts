import { styled } from 'styled-components'

export const Header = styled.header`
  display: flex;
  height: 10%;
  min-height: 125px;
  align-items: center;
  justify-content: center;
  gap: 1em;
  padding: 0.5em 0;
`

export const Title = styled.h1`
  font-size: 4.5em;
  line-height: 1em;
`

export const Game = styled.section`
  display: flex;
  justify-content: center;
  gap: 0.5em;
`

export const ChessBoardWrapper = styled.section`
  display: flex;
  flex: 0 0 calc(65vmin); /* 65% of the smaller viewport dimension */
  height: calc(65vmin); /* Ensure it stays square */
  border: solid #FFF;
  min-width: 0; /* Allow chess board to shrink on window resize */
`

export const Panel = styled.section`
  display: flex;  
  flex: 0 0 calc(30vmin); /* 30% of the smaller viewport dimension */
  border: solid #FFF;
`

export const Footer = styled.footer`
  display: flex;
  min-height: 85px;
  height: 5%;

  justify-content: center;
  align-items: center;
`
