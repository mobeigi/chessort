import { styled } from 'styled-components';
import { SuccessButton, PrimaryButton } from '../../styles/button';

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-evenly;
  gap: 1em;
  background: ${({ theme }) => theme.colors.container.background};
  color: ${({ theme }) => theme.colors.text.base};
  border-radius: inherit;
`;

export const Hub = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  width: 80%;
  gap: 2em;
`;

export const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  gap: 0.4em;
  padding: 0.5em 0.5em;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  // Support d&d on mobile
  touch-action: none;
`;

export const CardAndButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 97%;
`;

export const SubmitButton = styled(SuccessButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 3em;
`;

export const NextButton = styled(PrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 3em;
`;
