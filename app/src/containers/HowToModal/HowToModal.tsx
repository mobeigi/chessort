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
} from './styled';
import { Card1, Card2, Card3, Card4, WhiteMove, BlackMove } from './examples';

const numOfMovesToSort = 4;
const engineEvaluationDepthUsed = 22;
const discordInviteLink = 'https://discord.gg/pjJUG3CWnc';

const HowToContent = () => {
  const [revealed, setRevealed] = useState([false, false, false, false]);

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

  return (
    <HowToSection>
      <h2>How to play</h2>
      <p>
        <strong>Chessort</strong> is a Chess puzzle game where you sort moves based on the chess engine's evaluation.
      </p>
      <h4>Key points</h4>
      <ul>
        <li>
          <strong>{numOfMovesToSort}</strong> moves to sort from <strong>strongest</strong> (at top) to{' '}
          <strong>weakest</strong> (at bottom).
        </li>
        <li>
          <strong>Move</strong> and <strong>Piece</strong> colour indicates the player to move.{' '}
          <ExampleMoveWrapper>
            <WhiteMove />
            <BlackMove />
          </ExampleMoveWrapper>{' '}
        </li>
        <li>
          <strong>Drag & Drop</strong> to reorder. <strong>Click</strong> to preview moves.
        </li>
        <li>
          <strong>Check</strong> (<code>+</code>) and <strong>Checkmate</strong> (<code>#</code>) notations are
          initially hidden.
        </li>
        <li>Moves of equal strength can be correct in multiple positions.</li>
        <li>
          The <strong>engine's evaluation depth</strong> is set to <strong>{engineEvaluationDepthUsed}</strong>.
        </li>
      </ul>
      <h4>Example</h4>
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

      <DiscordContainer>
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
    maxWidth: '550px',
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
