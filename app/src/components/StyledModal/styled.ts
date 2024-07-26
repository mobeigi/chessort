import styled, { keyframes } from 'styled-components';

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
  isExiting: boolean;
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
  z-index: 1000;

  min-width: 40vw;
  min-height: 20vh;
  max-width: 80vw;
  max-height: 80vh;

  border-radius: 0.5em;
  outline: none;

  // Default styling
  color: #000;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 23px 0 rgba(0, 0, 0, 0.2);

  // Animation styles
  animation: ${({ isExiting }) => (isExiting ? slideOut : slideIn)} 0.2s forwards;
`;

export const ModalContentInner = styled.div`
  display: flex;
`;

export const Children = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-width: inherit;
  min-height: inherit;

  padding: 2em;
  box-sizing: border-box;
  border-radius: 0.5em;

  // Ensure children overflow if too long
  overflow: auto;
`;

export const OverlayStyle = styled.div<AnimationProps>`
  position: fixed;
  inset: 0px;
  z-index: 999;

  // Default styling
  background-color: rgba(255, 255, 255, 0.75);

  // Animation styles
  transition: opacity 0.2s ease;
  opacity: ${({ isExiting }) => (isExiting ? 0 : 1)};
`;

export const CloseIconWrapper = styled.span<{ color?: string; hoverColor?: string }>`
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  padding: 0;
  user-select: none;
  cursor: pointer;
  font-size: 2em;
  color: ${(props) => props.color || '#000'};

  &:hover {
    color: ${(props) => props.hoverColor || '#888'};
  }

  &:active {
    transform: scale(0.95);
  }
`;
