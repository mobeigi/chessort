import { styled } from 'styled-components';

export const Header = styled.header`
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
  height: 6em;

  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

export const Title = styled.h1`
  font-size: 4.5em;
  line-height: 1em;
`;

export const Footer = styled.footer`
  display: flex;
  min-height: 85px;
`;
