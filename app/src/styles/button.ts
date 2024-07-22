import { styled, css } from 'styled-components';

export const sharedButtonStyles = css`
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  color: #fff;
  background-color: #2b76a3;
  transition:
    border-color 0.25s,
    background-color 0.3s ease,
    transform 0.2s ease;

  &:hover {
    background-color: #5aa7cc;
  }

  &:active {
    background-color: #2b76a3;
  }

  &:focus,
  &:focus-visible {
    box-shadow: 0 0 0 0.25em rgba(43, 118, 163, 0.5); /* #2b76a3 */
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #666666;
    border-color: #999999;
  }

  &:disabled:hover {
    background-color: #cccccc;
  }
`;

const BaseButton = styled.button`
  ${sharedButtonStyles}
`;

export const PrimaryButton = styled(BaseButton)`
  ${sharedButtonStyles}
`;

export const SuccessButton = styled(BaseButton)`
  background-color: #4caf50;

  &:hover {
    background-color: #60d065;
  }

  &:active {
    background-color: #4caf50;
  }

  &:focus,
  &:focus-visible {
    box-shadow: 0 0 0 0.25em rgba(76, 175, 80, 0.5);
  }
`;
