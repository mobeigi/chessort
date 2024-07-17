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
  height: 80%;
  width: 90%;
  max-width: 1200px;
  max-height: 800px;
  gap: 1em;
`

export const ChessBoardWrapper = styled.section`
  display: flex;
  flex: 6; /* 60% of the container */
  border: solid #FFF;
  min-width: 0; /* Allow chess board to shrink on window resize */
  align-items: center;
  justify-content: center;
`

export const ChessBoardContainer = styled.div`
  border: solid red;
  width: 200px;
`

export const Panel = styled.section`
  display: flex;  
  flex: 4; /* 40% of the container */
  border: solid #FFF;
`

export const Footer = styled.footer`
  display: flex;
  min-height: 85px;
  height: 5%;

  justify-content: center;
  align-items: center;
`
