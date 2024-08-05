import { useEffect, useMemo, useState } from 'react';
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
import { ActionBarProps } from './types';
import { toast, TypeOptions } from 'react-toastify';
import { SvgIcon } from '../../../styles/icon';
import {
  BoardOrientation as BoardOrientationEnum,
  BoardOrientationType,
} from '../../../context/userPreferencesContext';

import ChessComLogoPawnSvg from '../../../assets/icons/chesscom_logo_pawn.svg?react';
import LichessLogoSvg from '../../../assets/icons/lichess-thick2.svg?react';
import HowToModal from '../../HowToModal';
import { renderToStaticMarkup } from 'react-dom/server';

const tooltipActionTimeout = 1500;
const sunColor = '#f8de26';
const moonColor = '#f5f5f5';

const getLichessAnalysisUrl = (fen: string) => {
  return `https://lichess.org/analysis/${fen}`;
};

const getChessComAnalysisUrl = (fen: string) => {
  return `https://www.chess.com/analysis?tab=analysis&fen=${fen}`;
};

const getCycleBoardTooltipElement = (boardOrientationNiceName: string) => {
  return (
    <span>
      Cycle board orientation
      <br />
      <br />
      Current: <strong>{boardOrientationNiceName}</strong>
    </span>
  );
};

const showToast = (message: string, type: TypeOptions, themeMode: ThemeMode) => {
  toast.info(message, {
    position: 'bottom-left',
    autoClose: 2000,
    type,
    theme: themeMode,
  });
};

export const ActionBar = ({ fen }: ActionBarProps) => {
  const { mode, toggleThemeMode, boardOrientation, setBoardOrientation, onboardingCompelte, setOnboardingComplete } =
    useUserPreferences();
  const [fenRecentlyCopied, setFenRecentlyCopied] = useState(false);
  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);

  /**
   * Trigger onboarding for new users
   */
  useEffect(() => {
    setTimeout(() => {
      if (!onboardingCompelte) {
        setIsHowToModalOpen(true);
        setOnboardingComplete(true);
      }
    }, 100); // Delay needed to allow rendering on mobile
  }, [onboardingCompelte, setOnboardingComplete]);

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
        showToast(`Unknown board orientation: ${boardOrientation}`, 'error', mode);
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

  const handleCopyFenError = (err: Error) => {
    console.error('Failed to copy FEN to clipboard:', err);
    showToast('Failed to copy FEN to clipboard.', 'error', mode);
  };

  const copyFen = (fen: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(fen)
        .then(() => {
          setFenRecentlyCopied(true);
          setTimeout(() => {
            setFenRecentlyCopied(false);
          }, tooltipActionTimeout);
        })
        .catch(handleCopyFenError);
    } else {
      handleCopyFenError(new Error('Clipboard API not supported'));
    }
  };

  const analyseOnLichessTooltipHtml = 'Analyse on <strong>Lichess.org</strong>';
  const analyseOnChessComTooltipHtml = 'Analyse on <strong>Chess.com</strong>';

  const boardOrientationNiceName = getBoardOrientationNiceName(boardOrientation);
  const cycleBoardTooltipElement = getCycleBoardTooltipElement(boardOrientationNiceName);
  const cycleBoardTooltipHtml = useMemo(
    () => renderToStaticMarkup(cycleBoardTooltipElement),
    [cycleBoardTooltipElement],
  );

  const copyFenTooltipText = fenRecentlyCopied ? 'Copied!' : 'Copy FEN';
  const copyFenTooltipVariant = fenRecentlyCopied ? 'success' : undefined;

  const otherThemeMode = mode == ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark;
  const themeModeSwitchTooltipHtml = `Switch to <strong>${otherThemeMode}</strong> mode`;

  return (
    <>
      <HowToModal isOpen={isHowToModalOpen} onRequestClose={() => setIsHowToModalOpen(false)} />
      <ActionBarContainer>
        <IconWrapper
          data-tooltip-id={`base-tooltip`}
          data-tooltip-content="How to play"
          data-tooltip-hidden={isHowToModalOpen} // Hide tooltip so it doesn't stay focused on mobile
          onClick={() => setIsHowToModalOpen(true)}
        >
          <i className="bx bxs-help-circle"></i>
        </IconWrapper>
        <IconWrapper
          data-tooltip-id={`base-tooltip`}
          data-tooltip-html={cycleBoardTooltipHtml}
          onClick={() => cycleBoardOrientation()}
        >
          <RotateIconWithAdjustments className="bx bx-rotate-left"></RotateIconWithAdjustments>
        </IconWrapper>
        <a href={getLichessAnalysisUrl(fen)} target="_blank" rel="external">
          <IconWrapper data-tooltip-id={`base-tooltip`} data-tooltip-html={analyseOnLichessTooltipHtml}>
            <LichessLogoIcon>
              <LichessLogoSvg />
            </LichessLogoIcon>
          </IconWrapper>
        </a>
        <a href={getChessComAnalysisUrl(fen)} target="_blank" rel="external">
          <IconWrapper data-tooltip-id={`base-tooltip`} data-tooltip-html={analyseOnChessComTooltipHtml}>
            <SvgIcon>
              <ChessComLogoPawnSvg />
            </SvgIcon>
          </IconWrapper>
        </a>
        <IconWrapper
          data-tooltip-id={`base-tooltip`}
          data-tooltip-variant={copyFenTooltipVariant}
          data-tooltip-content={copyFenTooltipText}
          onClick={() => copyFen(fen)}
        >
          <i className="bx bx-copy"></i>
        </IconWrapper>
        <IconWrapper
          data-tooltip-id={`base-tooltip`}
          data-tooltip-html={themeModeSwitchTooltipHtml}
          onClick={() => toggleThemeMode()}
        >
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
      </ActionBarContainer>
    </>
  );
};
