import StyledModal from '../../components/StyledModal';
import { useTheme } from 'styled-components';
import { hexToRgba } from '../../utils/themeUtils';
import { HowToModalProps } from './types';

export const HowToModal = ({ isOpen, onRequestClose }: HowToModalProps) => {
  const theme = useTheme();

  // Use theme for modal
  const modalStyle = {
    color: theme.colors.text.base,
    backgroundColor: theme.colors.container.background,
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
      <div>
        <h2>How to</h2>
        <p>TODO</p>
      </div>
    </StyledModal>
  );
};
