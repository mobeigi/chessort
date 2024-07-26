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
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      // Custom classnames are required to 'remove' default styling
      className="StyledModal_Content"
      overlayClassName="StyledModal_Overlay"
      style={{
        content: modalStyle,
        overlay: overlayStyle,
      }}
      contentElement={(props, children) => (
        <ModalStyle {...props}>
          <CloseIconWrapper onClick={onRequestClose} color={closeIconColor} hoverColor={closeIconHoverColor}>
            <i className="bx bx-x"></i>
          </CloseIconWrapper>
          <Children>{children}</Children>
        </ModalStyle>
      )}
      overlayElement={(props, contentElement) => <OverlayStyle {...props}>{contentElement}</OverlayStyle>}
    >
      {children}
    </Modal>
  );
};
