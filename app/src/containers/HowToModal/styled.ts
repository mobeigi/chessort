import styled from 'styled-components';

export const ModalContentWrapper = styled.div`
  max-width: 525px; // TODO: Use a breakpoint for this
`;

export const HowToSection = styled.section`
  h2,
  h4 {
    margin: 0.5em auto;
  }

  ul {
    margin: 0.2em auto;
  }
`;

export const ExampleCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;

  justify-content: center;
  align-items: center;
`;

export const ExampleCardWrapper = styled.div`
  width: 60%;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;
