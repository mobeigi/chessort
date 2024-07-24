import styled from 'styled-components';
import { ThemeMode } from '../../../types/theme';

type DarkModeSwitchWrapperProps = {
  $mode: ThemeMode;
};

export const DarkModeSwitchWrapper = styled.span<DarkModeSwitchWrapperProps>`
  * {
    // Set stroke based on theme, this seems to be only way to stoke the svg properly
    stroke: ${({ $mode }) => ($mode === ThemeMode.Light ? '#444' : '#bbb')};
  }
`;
