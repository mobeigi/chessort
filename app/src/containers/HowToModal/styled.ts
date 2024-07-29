import styled from 'styled-components';
import { SvgIcon } from '../../styles/icon';
import { getBaseColor, getTextShadowColor } from '../Panel/Card/utils';
import { Color } from '../../types/color';

export const HowToSection = styled.section`
  & h2 {
    margin: 0.4em auto 0.6em;
  }

  & p {
    margin: 0.4em auto;
  }

  & h5 {
    margin: 0.8em auto 0.4em;
  }

  & ul {
    margin-top: 0.1em;
    margin-bottom: 0.1em;
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

  // Animate cards with slide in effect
  opacity: ${({ $revealed }) => ($revealed ? 1 : 0)};
  transform: ${({ $revealed }) => ($revealed ? 'translateY(0)' : 'translateY(4em)')};
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;
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

export const ControlsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
`;

export const ControlsGroup = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`;

export const ControlGroupName = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 0.7em;
  font-family: 'Roboto Mono', monospace;
`;

export const ControlActions = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2em;
  font-size: 0.8em;
`;

export const DragIconAdjustmentWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  margin-left: 0.05em;

  & svg path,
  svg rect {
    fill: ${({ theme }) => theme.colors.text.base};
  }
`;

export const ClickIconAdjustmentWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.3em;

  & svg path,
  svg rect {
    fill: ${({ theme }) => theme.colors.text.base};
  }
`;

export const DoubleStackGrid = styled.span`
  display: grid;
  grid-template-rows: repeat(2, auto);
  gap: 0.2em;
`;

export const Key = styled.div`
  display: inline-block;
  min-width: 1em;
  border: 0.1em solid #fff;
  border-radius: 0.4em;
  padding: 0.6em 0.9em;
  background-color: #333;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  user-select: none;
`;

interface DiscordContainerProps {
  $animationDone: boolean;
}

export const DiscordContainer = styled.p<DiscordContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 1em;

  // Discord pallete
  color: #7289da;
  & a {
    color: #7289da;
  }

  & a:hover,
  & a:focus {
    color: #99aefb;
  }

  // Animation
  opacity: ${({ $animationDone }) => ($animationDone ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

export const DiscordLogoWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
