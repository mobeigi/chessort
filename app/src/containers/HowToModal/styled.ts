import styled from 'styled-components';
import { SvgIcon } from '../../styles/icon';
import { getBaseColor, getTextShadowColor } from '../Panel/Card/utils';
import { Color } from '../../types/color';

export const HowToSection = styled.section`
  & h2,
  & h4 {
    margin: 0.5em auto;
  }

  & ul {
    margin: 0.2em auto;
  }

  & li {
    margin: 0.4em auto;
  }
`;

export const ExampleCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  justify-content: center;
  align-items: center;
`;

export const ExampleCardWrapper = styled.div`
  width: 60%;

  // Overwrite padding to force the smallest form factor for the modal
  // TODO: This should be supported by the card itself via props
  & > *:first-child {
    padding: 0.2em 0.8em;
  }

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
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
