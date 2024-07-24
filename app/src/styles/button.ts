import { styled } from 'styled-components';

const BaseButton = styled.button``;

export const PrimaryButton = styled(BaseButton)``;

export const SuccessButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.status.success.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.status.success.baseHighlight};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.status.success.base};
  }

  &:focus,
  &:focus-visible {
    box-shadow: 0 0 0 0.25em rgba(76, 175, 80, 0.5);
  }
`;
