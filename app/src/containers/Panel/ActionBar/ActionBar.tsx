import { useState } from 'react';
import useUserPreferences from '../../../hooks/useUserPreferences';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { ThemeMode } from '../../../types/theme';
import {
  ActionBarContainer,
  LichessLogoIcon,
  IconWrapper,
  DarkModeSwitchWrapper,
  RotateIconWithAdjustments,
} from './styled';
import { Tooltip } from 'react-tooltip';
import { ActionBarProps } from './types';
import { toast, TypeOptions } from 'react-toastify';
import { SvgIcon } from '../../../styles/icon';
import {
  BoardOrientation as BoardOrientationEnum,
  BoardOrientationType,
} from '../../../context/userPreferencesContext';

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
  const { mode, toggleThemeMode, boardOrientation, setBoardOrientation } = useUserPreferences();
  const [fenRecentlyCopied, setFenRecentlyCopied] = useState(false);

  const showToast = (message: string, type: TypeOptions) => {
    toast.error(message, {
      position: 'bottom-left',
      autoClose: 2000,
      type,
      theme: mode,
    });
  };

  const getBoardOrientationNiceName = (boardOrientation: BoardOrientationType): string => {
    switch (boardOrientation) {
      case BoardOrientationEnum.White:
        return 'White on bottom';
      case BoardOrientationEnum.Black:
        return 'Black on bottom';
      case BoardOrientationEnum.Turn:
        return 'Turn player';
      default:
        console.error('Unknown board orientation:', boardOrientation);
        showToast(`Unknown board orientation: ${boardOrientation}`, 'error');
        return 'Unknown';
    }
  };

  const cycleBoardOrientation = () => {
    // Pick the next board orientation from the enum and set it
    const orientations = Object.values(BoardOrientationEnum) as BoardOrientationType[];
    const currentIndex = orientations.indexOf(boardOrientation);
    const nextIndex = (currentIndex + 1) % orientations.length;
    const nextBoardOrientation = orientations[nextIndex];
    setBoardOrientation(nextBoardOrientation);
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

  const boardOrientationNiceName = getBoardOrientationNiceName(boardOrientation);

  const copyFenTooltipText = fenRecentlyCopied ? 'Copied!' : 'Copy FEN';

  const otherThemeMode = mode == ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
  const themeModeSwitchTooltipText = `Switch to ${otherThemeMode} mode`;

  return (
    <ActionBarContainer>
      <IconWrapper data-tooltip-id={`help-tooltip`}>
        <i className="bx bxs-help-circle"></i>
      </IconWrapper>
      <IconWrapper data-tooltip-id={`flip-board-tooltip`} onClick={() => cycleBoardOrientation()}>
        <RotateIconWithAdjustments className="bx bx-rotate-left"></RotateIconWithAdjustments>
      </IconWrapper>
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
      <Tooltip id={`help-tooltip`} place="top">
        How to play
      </Tooltip>
      <Tooltip id={`flip-board-tooltip`} place="top">
        Cycle board orientation
        <br />
        <br />
        Current: <strong>{boardOrientationNiceName}</strong>
      </Tooltip>
      <Tooltip id={`analyse-lichess-tooltip`} place="top">
        Analyse on <strong>Lichess.org</strong>
      </Tooltip>
      <Tooltip id={`analyse-chesscom-tooltip`} place="top">
        Analyse on <strong>Chess.com</strong>
      </Tooltip>
      <Tooltip id={`theme-mode-switch-tooltip`} place="top">
        {themeModeSwitchTooltipText}
      </Tooltip>
      <Tooltip id={`copy-fen-tooltip`} place="top" variant={fenRecentlyCopied ? 'success' : undefined}>
        {copyFenTooltipText}
      </Tooltip>
    </ActionBarContainer>
  );
};
