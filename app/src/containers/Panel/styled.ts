import { styled } from 'styled-components';
import { SuccessButton, PrimaryButton } from '../../styles/button';

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: 1em;
  background: linear-gradient(135deg, #242424, #36454f);
`;

export const DescriptionWrapper = styled.main`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 0.2em;

  p {
    margin: 0;
    padding: 0;
  }
`;

export const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  justify-content: center;
  gap: 0.4em;
  padding: 0.5em 0.5em;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const SubmitButton = styled(SuccessButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const NextButton = styled(PrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
