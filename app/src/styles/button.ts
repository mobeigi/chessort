import { styled } from 'styled-components';

const BaseButton = styled.button``;

export const PrimaryButton = styled(BaseButton)``;

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
