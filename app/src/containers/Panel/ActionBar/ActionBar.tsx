import { useState } from 'react';
import useThemeMode from '../../../hooks/useThemeMode';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { ThemeMode } from '../../../types/theme';
import { ActionBarContainer, LichessLogoIcon, IconWrapper, DarkModeSwitchWrapper } from './styled';
import { Tooltip } from 'react-tooltip';
import { ActionBarProps } from './types';
import { toast, TypeOptions } from 'react-toastify';
import { SvgIcon } from '../../../styles/icon';

import ChessComLogoPawnSvg from '../../../assets/icons/chesscom_logo_pawn.svg?react';
import LichessLogoSvg from '../../../assets/icons/lichess_logo.svg?react';

const tooltipActionTimeout = 1500;
const sunColor = '#f8de26';
const moonColor = '#f5f5f5';

const getLichessAnalysisUrl = (fen: string) => {
  return `https://lichess.org/analysis/${fen}`;
};

const getChessComAnalysisUrl = (fen: string) => {
  return `https://www.chess.com/analysis?tab=analysis&fen=${fen}`;
};

export const ActionBar = ({ fen }: ActionBarProps) => {
  const { mode, toggleThemeMode } = useThemeMode();
  const [fenRecentlyCopied, setFenRecentlyCopied] = useState(false);

  const showToast = (message: string, type: TypeOptions) => {
    toast.error(message, {
      position: 'bottom-left',
      autoClose: 2000,
      type,
      theme: mode,
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
        showToast(`Failed to copy FEN to clipboard.`, 'error');
      });
  };

  const copyFenTooltipText = fenRecentlyCopied ? 'Copied!' : 'Copy FEN';

  const otherThemeMode = mode == ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
  const themeModeSwitchTooltipText = `Switch to ${otherThemeMode} mode`;

  return (
    <ActionBarContainer>
      <a href={getLichessAnalysisUrl(fen)} target="_blank">
        <IconWrapper data-tooltip-id={`analyse-lichess-tooltip`}>
          <LichessLogoIcon>
            <LichessLogoSvg />
          </LichessLogoIcon>
        </IconWrapper>
      </a>
      <a href={getChessComAnalysisUrl(fen)} target="_blank">
        <IconWrapper data-tooltip-id={`analyse-chesscom-tooltip`}>
          <SvgIcon>
            <ChessComLogoPawnSvg />
          </SvgIcon>
        </IconWrapper>
      </a>
      <IconWrapper data-tooltip-id={`copy-fen-tooltip`} onClick={() => copyFen(fen)}>
        <i className="bx bxs-chess"></i>
      </IconWrapper>
      <IconWrapper data-tooltip-id={`theme-mode-switch-tooltip`} onClick={() => toggleThemeMode()}>
        <DarkModeSwitchWrapper $mode={mode}>
          <DarkModeSwitch
            checked={mode == ThemeMode.Dark}
            onChange={() => {}} /* We use onClick on icon wrapper instead */
            size={'0.9em'}
            sunColor={sunColor}
            moonColor={moonColor}
          />
        </DarkModeSwitchWrapper>
      </IconWrapper>
      {/* Tooltips */}
      <Tooltip id={`analyse-lichess-tooltip`} place="right">
        Analyse on <strong>Lichess.org</strong>
      </Tooltip>
      <Tooltip id={`analyse-chesscom-tooltip`} place="right">
        Analyse on <strong>Chess.com</strong>
      </Tooltip>
      <Tooltip id={`theme-mode-switch-tooltip`} place="right">
        {themeModeSwitchTooltipText}
      </Tooltip>
      <Tooltip id={`copy-fen-tooltip`} place="right" variant={fenRecentlyCopied ? 'success' : undefined}>
        {copyFenTooltipText}
      </Tooltip>
    </ActionBarContainer>
  );
};
