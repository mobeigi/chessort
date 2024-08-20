import { Link } from 'react-router-dom';
import {
  Line,
  GameId,
  DifficultyLozenge,
  DescriptionContainer,
  HitsContainer,
  HitCounter,
  JoystickIconAdjustmentWrapper,
  ChessBoardAdjustmentWrapper,
} from './styled';
import { DescriptionProps } from './types';
import CountUp from 'react-countup';

export const Description = ({ gameId, difficulty, positionHits, gameHits }: DescriptionProps) => {
  const gameLink = `/game/${gameId}/`;

  const gameHitsTooltipHtml = `<span>Game (position + moves) played <strong>${gameHits}</strong> times.</span>`;
  const positionHitsTooltipHtml = `<span>Position (FEN) played <strong>${positionHits}</strong> times.</span>`;
  const difficultyLozengeTooltipHtml = `<span><strong>[BETA]</strong> Estimated solve difficulty for humans.</span>`;

  return (
    <DescriptionContainer>
      <Line>
        <strong>Game:</strong>
        <GameId>
          <Link to={gameLink}>#{gameId}</Link>
        </GameId>
      </Line>
      <Line>
        <strong>Hits:</strong>
        <HitsContainer>
          <HitCounter data-tooltip-id="base-tooltip" data-tooltip-html={gameHitsTooltipHtml}>
            <JoystickIconAdjustmentWrapper>
              <i className="bx bx-joystick-alt"></i>
            </JoystickIconAdjustmentWrapper>
            <span>
              <CountUp end={gameHits} />
            </span>
          </HitCounter>
          <span>•</span>
          <HitCounter data-tooltip-id="base-tooltip" data-tooltip-html={positionHitsTooltipHtml}>
            <ChessBoardAdjustmentWrapper>
              <i className="bx bxs-chess"></i>
            </ChessBoardAdjustmentWrapper>
            <span>
              <CountUp end={positionHits} />
            </span>
          </HitCounter>
        </HitsContainer>
      </Line>
      <Line>
        <strong>Difficulty:</strong>
        <DifficultyLozenge
          $difficulty={difficulty}
          data-tooltip-id="base-tooltip"
          data-tooltip-html={difficultyLozengeTooltipHtml}
        >
          {difficulty}
        </DifficultyLozenge>
      </Line>
    </DescriptionContainer>
  );
};
