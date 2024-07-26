import { useState } from 'react';

import Modal from 'react-modal';
import { ModalStyle, OverlayStyle, Children, CloseIconWrapper } from './styled';
import { StyledModalProps } from './types';

export const StyledModal = ({
  isOpen,
  onRequestClose,
  children,
  modalStyle,
  overlayStyle,
  closeIconColor,
  closeIconHoverColor,
}: StyledModalProps) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRequestClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRequestClose();
      setIsExiting(false);
    }, 200); // Match duration of the slideOut animation
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      // Custom classnames are required to 'remove' default styling
      className="StyledModal_Content"
      overlayClassName="StyledModal_Overlay"
      style={{
        content: modalStyle,
        overlay: overlayStyle,
      }}
      contentElement={(props, children) => (
        <ModalStyle $isExiting={isExiting} {...props}>
          <CloseIconWrapper onClick={handleRequestClose} $color={closeIconColor} $hoverColor={closeIconHoverColor}>
            <i className="bx bx-x"></i>
          </CloseIconWrapper>
          <Children>{children}</Children>
        </ModalStyle>
      )}
      overlayElement={(props, contentElement) => (
        <OverlayStyle $isExiting={isExiting} {...props}>
          {contentElement}
        </OverlayStyle>
      )}
    >
      {children}
    </Modal>
  );
};
