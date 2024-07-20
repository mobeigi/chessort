import { styled } from 'styled-components';

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  box-sizing: border-box; /* Ensure padding is included in element so you can slightly drag upwards/outwards at first/last dragables */

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const SubmitButton = styled.button`
  width: 90%;

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

export const NextButton = styled.button`
  width: 90%;
`;
