import styled from 'styled-components';

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

  // Overwrite padding to force the smallest form factor for the modal
  // TODO: This should be supported by the card itself via props
  & > *:first-child {
    padding: 0.2em 0.8em;
  }

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;
