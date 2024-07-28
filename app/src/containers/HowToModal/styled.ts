import styled, { keyframes, css } from 'styled-components';
import { SvgIcon } from '../../styles/icon';
import { getBaseColor, getTextShadowColor } from '../Panel/Card/utils';
import { Color } from '../../types/color';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInCss = css`
  ${fadeIn} 0.5s ease-in-out
`;

export const HowToSection = styled.section`
  & h2,
  & h4 {
    margin: 0.5em auto;
  }
`;

export const ExampleCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  justify-content: center;
  align-items: center;
`;

interface ExampleCardWrapperProps {
  $revealed: boolean;
}

export const ExampleCardWrapper = styled.div<ExampleCardWrapperProps>`
  width: 60%;
  min-width: 220px;

  // Overwrite padding to force the smallest form factor for the modal
  // TODO: This should be supported by the card itself via props
  & > *:first-child {
    padding: 0.2em 0.8em;
  }

  // Disable select
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  // Animate cards with fade in
  opacity: ${({ $revealed }) => ($revealed ? 1 : 0)};
  animation: ${({ $revealed }) => ($revealed ? fadeInCss : 'none')};
  transition: opacity 0.5s ease-in-out;
`;

export const ExampleSanMoveWrapper = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  background-color: #b88762;
  border-radius: 10%;
  padding: 0em 0.1em;
`;

interface ExampleSanMovePieceProps {
  $color: Color;
}

export const ExampleMoveNotation = styled.span<ExampleSanMovePieceProps>`
  font-weight: bold;
  font-family: 'Roboto Mono', monospace;
  color: ${(props) => getBaseColor(props.$color)};
  text-shadow: 0px 0px 4px ${(props) => getTextShadowColor(props.$color)};
`;

export const ExampleMovePieceIcon = styled(SvgIcon)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
`;

export const ExampleMoveWrapper = styled.div`
  display: inline-flex;
  gap: 0.4em;
`;

export const DiscordContainer = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;

  // Discord pallete
  color: #7289da;
  & a {
    color: #7289da;
  }

  & a:hover,
  & a:focus {
    color: #99aefb;
  }
`;

export const DiscordLogoWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
