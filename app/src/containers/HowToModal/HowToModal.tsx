import StyledModal from '../../components/StyledModal';
import { useTheme } from 'styled-components';
import { hexToRgba } from '../../utils/themeUtils';
import { HowToModalProps } from './types';
import { HowToSection, ExampleCardsContainer, ExampleCardWrapper } from './styled';
import { Card1, Card2, Card3, Card4 } from './examples';

const HowToContent = () => {
  const numOfMovesToSort = 4;
  const engineEvaluationDepthUsed = 22;

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
          <strong>Move</strong> and <strong>Piece</strong> color indicates the player to move.
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
        <ExampleCardWrapper>
          <Card1 />
        </ExampleCardWrapper>
        <ExampleCardWrapper>
          <Card2 />
        </ExampleCardWrapper>
        <ExampleCardWrapper>
          <Card4 />
        </ExampleCardWrapper>
        <ExampleCardWrapper>
          <Card3 />
        </ExampleCardWrapper>
      </ExampleCardsContainer>

      <p>For discussion, feature requests, bug reports, please visit: TODO</p>
    </HowToSection>
  );
};

export const HowToModal = ({ isOpen, onRequestClose }: HowToModalProps) => {
  const theme = useTheme();

  // Use theme for modal
  const modalStyle = {
    color: theme.colors.text.base,
    backgroundColor: theme.colors.container.background,
    maxWidth: '525px',
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
