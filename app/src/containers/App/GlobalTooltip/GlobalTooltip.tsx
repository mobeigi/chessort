import { Tooltip } from 'react-tooltip';
import { GlobalTooltipWrapper } from './styled';

// Provides a top level tooltip that can be reused by the entire app
// It is best practice to store one copy of this tooltip and reuse it for performance and to various DOM render bugs
export const GlobalTooltip = () => (
  <GlobalTooltipWrapper>
    {/* TODO: this should support themes */}
    <Tooltip id={`base-tooltip`} place="top" variant="dark" opacity={0.9} />
  </GlobalTooltipWrapper>
);
