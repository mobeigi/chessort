import { styled } from 'styled-components'

export const Header = styled.header`
  display: flex;
  height: 15%;
  min-height: 125px;
  align-items: center;
  justify-content: center;
  gap: 1em;
  // padding: 1em;
`

export const Title = styled.h1`
  font-size: 4.5em;
  line-height: 1em;
`

export const Game = styled.section`
  display: flex;
  height: 80%;
  width: 90%;
  gap: 1em;

  // justify-content: center;
  // align-items: center;

  // padding: 1em;

  // min-height: 300px;
  // max-height: 80%;

  // min-width: 600px;
`

export const ChessBoardWrapper = styled.section`
  display: flex;
  flex: 6; /* 60% of the container */
  border: solid #FFF;
`

export const Panel = styled.section`
  display: flex;  
  flex: 4; /* 40% of the container */
  border: solid #FFF;
`

// export const ChessBoardWrapper = styled.section`
//   flex: 6; /* 60% of the container */
//   display: flex;
//   border: solid #FFF;
//   min-width: 0; /* Allow chess board to shrink on window resize */
//   max-width: 80vh; /* ChessBoard resizes automatically based on parents width */
// `

// export const Panel = styled.section`
//   flex: 4; /* 40% of the container */
//   display: flex;
//   border: solid #FFF;
// `

export const Footer = styled.footer`
  display: flex;
  min-height: 85px;
  height: 5%;

  justify-content: center;
  align-items: center;
`