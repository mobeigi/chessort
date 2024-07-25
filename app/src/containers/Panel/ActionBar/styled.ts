import styled from 'styled-components';
import { ThemeMode } from '../../../types/theme';
import { SvgIcon } from '../../../styles/icon';
import { hexToRgba } from '../../../utils/themeUtils';

export const ActionBarContainer = styled.div`
  display: flex;
  align-items: center;
`;

type DarkModeSwitchWrapperProps = {
  $mode: ThemeMode;
};

export const DarkModeSwitchWrapper = styled.span<DarkModeSwitchWrapperProps>`
  display: flex;
  * {
    // Set stroke based on theme, this seems to be only way to stoke the svg properly
    stroke: ${({ $mode }) => ($mode === ThemeMode.Light ? '#444' : '#bbb')};
  }
`;

export const IconWrapper = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  color: ${({ theme }) => theme.colors.text.base};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.baseHighlight};
  }

  // Add grey circle backdrop on hover to icon
  width: 1.2em;
  height: 1.2em;

  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.2em;
    height: 1.2em;
    background-color: ${({ theme }) => hexToRgba(theme.colors.text.baseHighlight, 0.1)};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const LichessLogoIcon = styled(SvgIcon)`
  svg path {
    stroke-width: 2;
    fill: ${({ theme }) => theme.colors.text.base};
    stroke: ${({ theme }) => theme.colors.text.base};
  }

  &:hover svg path {
    fill: ${({ theme }) => theme.colors.text.baseHighlight};
    stroke: ${({ theme }) => theme.colors.text.baseHighlight};
  }
`;
