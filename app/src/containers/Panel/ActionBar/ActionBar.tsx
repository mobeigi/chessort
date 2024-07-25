import { useState } from 'react';
import useThemeMode from '../../../hooks/useThemeMode';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { ThemeMode } from '../../../types/theme';
import { ActionBarContainer, IconWrapper, DarkModeSwitchWrapper } from './styled';
import { Tooltip } from 'react-tooltip';
import { ActionBarProps } from './types';
import { toast, TypeOptions } from 'react-toastify';

const tooltipActionTimeout = 1500;

export const ActionBar = ({ fen }: ActionBarProps) => {
  const { mode, toggleThemeMode } = useThemeMode();
  const [fenRecentlyCopied, setFenRecentlyCopied] = useState(false);

  const showToast = (message: string, type: TypeOptions) => {
    toast.error(message, {
      position: 'bottom-left',
      autoClose: 2000,
      type,
    });
  };

  const copyFen = (fen: string) => {
    navigator.clipboard
      .writeText(fen)
      .then(() => {
        setFenRecentlyCopied(true);
        setTimeout(() => {
          setFenRecentlyCopied(false);
        }, tooltipActionTimeout);
      })
      .catch((err) => {
        console.error('Failed to copy FEN to clipboard: ', err);
        showToast(`Failed to copy FEN to clipboard`, 'error');
      });
  };

  const copyFenTooltipText = fenRecentlyCopied ? 'Copied!' : 'Copy FEN';

  const otherThemeMode = mode == ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
  const themeModeSwitchTooltipText = `Switch to ${otherThemeMode} mode`;

  return (
    <ActionBarContainer>
      <IconWrapper data-tooltip-id={`copy-fen-tooltip`} onClick={() => copyFen(fen)}>
        <i className="bx bx-copy"></i>
      </IconWrapper>
      <DarkModeSwitchWrapper data-tooltip-id={`theme-mode-switch-tooltip`} $mode={mode}>
        <DarkModeSwitch
          checked={mode == ThemeMode.Dark}
          onChange={() => toggleThemeMode()}
          size={'1.5em'}
          sunColor={'#f8de26'}
          moonColor={'#f5f5f5'}
        />
      </DarkModeSwitchWrapper>
      {/* Tooltips */}
      <Tooltip id={`theme-mode-switch-tooltip`} place="right">
        {themeModeSwitchTooltipText}
      </Tooltip>
      <Tooltip id={`copy-fen-tooltip`} place="right" variant={fenRecentlyCopied ? 'success' : undefined}>
        {copyFenTooltipText}
      </Tooltip>
    </ActionBarContainer>
  );
};
