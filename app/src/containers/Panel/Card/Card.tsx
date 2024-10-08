import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CardContainer,
  CurrentRankWrapper,
  CurrentRankNumberWrapper,
  StatusIconWrapper,
  SanMoveWrapper,
  MovePieceIcon,
  MoveNotation,
  EngineRankWrapper,
  EngineRank,
  EngineEvalWrapper,
  OneDigitGrid,
  TwoDigitGrid,
  ThreeDigitGrid,
  FourDigitGrid,
} from './styled';
import { CardProps } from './types';
import { MoveDetail } from '../../../context/gameContext/types';
import CorrectIcon from '../../../assets/icons/correct.svg?react';
import IncorrectIcon from '../../../assets/icons/incorrect.svg?react';
import CurrentRankIcon from '../../../assets/icons/two-way.svg?react';
import { evaluateAdvantage, formatEvaluation, getOrdinalSuffix } from './utils';
import { Color } from '../../../types/color';
import { getPieceSvgBySan } from '../../../utils/chessUtils';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMemo } from 'react';

const getStatusIcon = (revealed: boolean, curRank: number, correctRanks: number[]) => {
  if (!revealed) {
    return CurrentRankIcon;
  }
  if (correctRanks.includes(curRank)) {
    return CorrectIcon;
  }
  return IncorrectIcon;
};

function removeCheckAndMateSymbols(sanMove: string): string {
  if (sanMove.endsWith('#') || sanMove.endsWith('+')) {
    return sanMove.slice(0, -1);
  }
  return sanMove;
}

const getCurrentRankTooltipElement = (correctRanks: number[]) => {
  // Convert ranks to ordinal suffixes
  const ordinalRanks = correctRanks.map((rank) => getOrdinalSuffix(rank));

  // Determine the correct phrasing based on the number of positions
  const count = ordinalRanks.length;
  let tooltipText = '';

  if (count === 1) {
    tooltipText = `This move is correct only in the ${ordinalRanks[0]} position.`;
  } else if (count === 2) {
    tooltipText = `This move is correct in the ${ordinalRanks[0]} or ${ordinalRanks[1]} position.`;
  } else if (count >= 3) {
    const lastOrdinal = ordinalRanks.pop(); // Remove the last ordinal
    tooltipText = `This move is correct in the ${ordinalRanks.join(', ')}, and ${lastOrdinal} position.`;
  }

  return <>{tooltipText}</>;
};

const getEngineRankTooltipElement = (moveDetail: MoveDetail) => (
  <>
    This is the engine's <strong>{getOrdinalSuffix(moveDetail.evalResult!.engineOverallRank)}</strong> best move.
  </>
);

const getDigitGrid = (numDigits: number) => {
  switch (numDigits) {
    case 1:
      return OneDigitGrid;
    case 2:
      return TwoDigitGrid;
    case 3:
      return ThreeDigitGrid;
    case 4:
      return FourDigitGrid;
    default:
      throw new Error('Invalid number of digits. Must be between 1 and 4.');
  }
};

export const Card = ({ moveDetail, sanMove, turnPlayer, revealed, correctRanks, onClick, isPreviewed }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: moveDetail.uciMove,
  });
  const transformStyle = CSS.Transform.toString(transform);

  const DigitGridComponent = revealed ? getDigitGrid(correctRanks.length) : OneDigitGrid;
  const currentRankTooltipText = revealed ? getCurrentRankTooltipElement(correctRanks) : null;
  const currentRankTooltipHtml = useMemo(() => renderToStaticMarkup(currentRankTooltipText), [currentRankTooltipText]);

  const advantageColor = revealed ? evaluateAdvantage(moveDetail.evalResult!.engineEval) : Color.Neutral;

  const formattedSanMove = revealed ? sanMove : removeCheckAndMateSymbols(sanMove);

  const engineRankTooltipElement = revealed ? getEngineRankTooltipElement(moveDetail) : null;
  const engineRankTooltipHtml = useMemo(
    () => renderToStaticMarkup(engineRankTooltipElement),
    [engineRankTooltipElement],
  );

  const engineEvalValue = revealed ? formatEvaluation(moveDetail.evalResult!.engineEval) : '?';

  const StatusIcon = getStatusIcon(revealed, moveDetail.curRank, correctRanks);
  const MovePieceSvg = getPieceSvgBySan(sanMove, turnPlayer);

  return (
    <CardContainer
      ref={setNodeRef}
      style={{ transform: transformStyle, transition }}
      $isDragging={isDragging}
      $isPreviewed={isPreviewed}
      $revealed={revealed}
      {...attributes}
      {...listeners}
      onClick={() => onClick(moveDetail.uciMove)}
      tabIndex={undefined} // Disable browser card focus as we have our own keyboard mechanism in place for the cards
    >
      <CurrentRankWrapper data-tooltip-id={`base-tooltip`} data-tooltip-html={currentRankTooltipHtml}>
        <StatusIconWrapper>
          <StatusIcon />
        </StatusIconWrapper>
        <CurrentRankNumberWrapper>
          <DigitGridComponent>
            {revealed ? (
              correctRanks.map((digit, index) => <span key={index}>{digit}</span>)
            ) : (
              <span>{moveDetail.curRank}</span>
            )}
          </DigitGridComponent>
        </CurrentRankNumberWrapper>
      </CurrentRankWrapper>
      <SanMoveWrapper>
        <MovePieceIcon>
          <MovePieceSvg />
        </MovePieceIcon>
        <MoveNotation $color={turnPlayer}>{formattedSanMove}</MoveNotation>
      </SanMoveWrapper>
      {revealed && (
        <EngineRankWrapper data-tooltip-id={`base-tooltip`} data-tooltip-html={engineRankTooltipHtml}>
          <EngineRank $rank={moveDetail.evalResult!.engineOverallRank}></EngineRank>
        </EngineRankWrapper>
      )}
      <EngineEvalWrapper $advantageFor={advantageColor}>{engineEvalValue}</EngineEvalWrapper>
    </CardContainer>
  );
};
