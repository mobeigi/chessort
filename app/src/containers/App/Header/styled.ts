import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  min-height: 125px;
  align-items: center;
  justify-content: center;
  gap: 1em;

  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const Logo = styled.img`
  height: calc(4.5em * 1.33); /* Refer to font size of Title */

  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    height: calc(3.5em * 1.33); /* Refer to font size of Title */
  }
`;

export const Title = styled.h1`
  font-size: 4.5em;
  margin: 0.5em auto;

  color: ${({ theme }) => theme.colors.text.base};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.text.baseHighlight};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile.maxWidth}px) {
    font-size: 3.5em;
  }
`;
