import styled from 'styled-components';
import { ThemeMode } from '../../../types/theme';

export const ActionBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

type DarkModeSwitchWrapperProps = {
  $mode: ThemeMode;
};

export const DarkModeSwitchWrapper = styled.span<DarkModeSwitchWrapperProps>`
  * {
    // Set stroke based on theme, this seems to be only way to stoke the svg properly
    stroke: ${({ $mode }) => ($mode === ThemeMode.Light ? '#444' : '#bbb')};
  }
`;

export const IconWrapper = styled.span`
  display: flex;

  font-size: 1.5em;
  color: ${({ theme }) => theme.colors.text.base};

  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.baseHighlight};
  }
`;
