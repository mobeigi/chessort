import styled from 'styled-components';

export const ModalStyle = styled.div`
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: 10000;

  min-width: 40vw;
  min-height: 20vh;
  max-width: 80vw;
  max-height: 80vh;

  padding: 2em;
  overflow: auto;

  border-radius: 0.5em;
  outline: none;

  // Default styling
  color: #000;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 23px 0 rgba(0, 0, 0, 0.2);
`;

export const Children = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-width: inherit;
  min-height: inherit;
`;

export const OverlayStyle = styled.div`
  position: fixed;
  inset: 0px;
  z-index: 9999;

  // Default styling
  background-color: rgba(255, 255, 255, 0.75);
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
