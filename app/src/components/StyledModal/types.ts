import { ReactNode } from 'react';

export interface StyledModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  modalStyle?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
  closeIconColor?: string;
  closeIconHoverColor?: string;
}
