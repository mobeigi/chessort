import styled, { keyframes } from 'styled-components';
import zIndex from '../../styles/zindex';

const slideIn = keyframes`
  from {
    transform: translate(-50%, -30%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  0% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
  90% {
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -15%);
    opacity: 0;
  }
`;

export interface AnimationProps {
  $isExiting: boolean;
}

export const ModalStyle = styled.div<AnimationProps>`
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);

  // Default sizing
  width: auto;
  height: auto;
  max-width: 85vw;
  max-height: 85vh;

  // Default styling
  color: #000;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 23px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
  outline: none;

  // Animation styles
  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.2s forwards;
`;

export const Children = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 1em 2em 1em 2em;

  // Ensure children overflow if too long
  overflow: auto;
`;

export const OverlayStyle = styled.div<AnimationProps>`
  position: fixed;
  inset: 0px;
  z-index: ${zIndex.modal};

  // Default styling
  background-color: rgba(255, 255, 255, 0.75);

  // Animation styles
  transition: opacity 0.2s ease;
  opacity: ${({ $isExiting }) => ($isExiting ? 0 : 1)};
`;

export interface CloseIconWrapperProps {
  $color?: string;
  $hoverColor?: string;
}

export const CloseIconWrapper = styled.span<CloseIconWrapperProps>`
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  padding: 0;
  user-select: none;
  cursor: pointer;
  font-size: 2em;
  color: ${(props) => props.$color || '#000'};

  &:hover {
    color: ${(props) => props.$hoverColor || '#888'};
  }

  &:active {
    transform: scale(0.95);
  }
`;
