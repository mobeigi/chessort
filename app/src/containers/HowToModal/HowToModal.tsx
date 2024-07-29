import { useState, useEffect } from 'react';
import StyledModal from '../../components/StyledModal';
import { useTheme } from 'styled-components';
import { hexToRgba } from '../../utils/themeUtils';
import { HowToModalProps } from './types';
import {
  HowToSection,
  ExampleCardsContainer,
  ExampleCardWrapper,
  ExampleMoveWrapper,
  DiscordContainer,
  DiscordLogoWrapper,
  ControlsWrapper,
  ControlsGroup,
  ControlGroupName,
  ControlActions,
  DoubleStackGrid,
  Key,
  ClickIconAdjustmentWrapper,
  DragIconAdjustmentWrapper,
} from './styled';
import { Card1, Card2, Card3, Card4, WhiteMove, BlackMove } from './examples';
import { SvgIcon } from '../../styles/icon';
import DropSvg from '../../assets/icons/Drop.svg?react';
import ClickSvg from '../../assets/icons/click.svg?react';

const numOfMovesToSort = 4;
const engineEvaluationDepthUsed = 22;
const discordInviteLink = 'https://discord.gg/pjJUG3CWnc';

const HowToContent = () => {
  const [revealed, setRevealed] = useState([false, false, false, false]);
  const [discordAnimationDone, setDiscordAnimationDone] = useState(false);

  // Reveal cards one by one with delay
  useEffect(() => {
    const timeouts: number[] = [];
    for (let i = 0; i < revealed.length; i++) {
      timeouts.push(
        setTimeout(
          () => {
            setRevealed((prev) => {
              const newRevealed = [...prev];
              newRevealed[i] = true;
              return newRevealed;
            });
          },
          100 * (i + 1),
        ),
      );
    }
    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [revealed.length]);

  // Animate Discord container shorly after card animations are done
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDiscordAnimationDone(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <HowToSection>
      <h2>How to play</h2>
      <p>
        <strong>Chessort</strong> is a Chess puzzle game where you sort moves based on the chess engine's evaluation.
      </p>
      <h5>Key points</h5>
      <ul>
        <li>
          Sort <strong>{numOfMovesToSort}</strong> moves from <strong>strongest</strong> to <strong>weakest</strong>.
        </li>
        <li>
          <strong>Move</strong> and <strong>Piece</strong> colour indicates the player to move.{' '}
          <ExampleMoveWrapper>
            <WhiteMove />
            <BlackMove />
          </ExampleMoveWrapper>{' '}
        </li>

        <li>
          <strong>Check</strong> (<code>+</code>) and <strong>Checkmate</strong> (<code>#</code>) notations are
          initially hidden.
        </li>
      </ul>
      <h5>Controls</h5>
      <ControlsWrapper>
        <ControlsGroup>
          <ControlGroupName>Toggle Preview</ControlGroupName>
          <ControlActions>
            <DoubleStackGrid>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'1 Key'}>
                1
              </Key>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'3 Key'}>
                3
              </Key>
            </DoubleStackGrid>
            <DoubleStackGrid>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'2 Key'}>
                2
              </Key>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'4 Key'}>
                4
              </Key>
            </DoubleStackGrid>
            <ClickIconAdjustmentWrapper>
              <SvgIcon data-tooltip-id={'base-tooltip'} data-tooltip-content={'Mouse click'}>
                <ClickSvg />
              </SvgIcon>
            </ClickIconAdjustmentWrapper>
          </ControlActions>
        </ControlsGroup>
        <ControlsGroup>
          <ControlGroupName>Move Card</ControlGroupName>
          <ControlActions>
            <DoubleStackGrid>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'Up Arrow'}>
                ⬆
              </Key>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'Down Arrow'}>
                ⬇
              </Key>
            </DoubleStackGrid>
            <DoubleStackGrid>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'W Key'}>
                W
              </Key>
              <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'S Key'}>
                S
              </Key>
            </DoubleStackGrid>
            <DragIconAdjustmentWrapper>
              <SvgIcon data-tooltip-id={'base-tooltip'} data-tooltip-content={'Drag & Drop'}>
                <DropSvg />
              </SvgIcon>
            </DragIconAdjustmentWrapper>
          </ControlActions>
        </ControlsGroup>
        <ControlsGroup>
          <ControlGroupName>Submit / Next</ControlGroupName>
          <ControlActions>
            <Key data-tooltip-id={'base-tooltip'} data-tooltip-content={'Enter Key'}>
              Enter ⏎
            </Key>
            <ClickIconAdjustmentWrapper>
              <SvgIcon data-tooltip-id={'base-tooltip'} data-tooltip-content={'Mouse click'}>
                <ClickSvg />
              </SvgIcon>
            </ClickIconAdjustmentWrapper>
          </ControlActions>
        </ControlsGroup>
      </ControlsWrapper>
      <h5>Example</h5>
      <ExampleCardsContainer>
        <ExampleCardWrapper $revealed={revealed[0]}>
          <Card1 />
        </ExampleCardWrapper>
        <ExampleCardWrapper $revealed={revealed[1]}>
          <Card2 />
        </ExampleCardWrapper>
        <ExampleCardWrapper $revealed={revealed[2]}>
          <Card4 />
        </ExampleCardWrapper>
        <ExampleCardWrapper $revealed={revealed[3]}>
          <Card3 />
        </ExampleCardWrapper>
      </ExampleCardsContainer>

      <DiscordContainer $animationDone={discordAnimationDone}>
        <a href={discordInviteLink} target="_blank">
          <span>Join the conversation on </span>
          <DiscordLogoWrapper>
            <i className="bx bxl-discord"></i>
            <strong>Discord</strong>
          </DiscordLogoWrapper>
        </a>
      </DiscordContainer>
    </HowToSection>
  );
};

export const HowToModal = ({ isOpen, onRequestClose }: HowToModalProps) => {
  const theme = useTheme();

  // Use theme for modal
  const modalStyle = {
    color: theme.colors.text.base,
    backgroundColor: theme.colors.container.background,
    maxWidth: 'calc(min(550px, 100vw))',
  };
  const overlayStyle = {
    backgroundColor: hexToRgba(theme.colors.container.background, 0.75),
  };
  const closeIconColor = theme.colors.text.base;
  const closeIconHoverColor = theme.colors.text.baseHighlight;

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      modalStyle={modalStyle}
      overlayStyle={overlayStyle}
      closeIconColor={closeIconColor}
      closeIconHoverColor={closeIconHoverColor}
    >
      <HowToContent />
    </StyledModal>
  );
};
