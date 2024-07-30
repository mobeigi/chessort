import { useEffect, useRef, useState } from 'react';
import { ChessgroundContainer } from './styled';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { ChessGroundBoardProps } from './types';
import { initialConfig } from './initialConfig';

import '../../assets/chessground/chessground.base.css';
import '../../assets/pieces/maestro/chessground.maestro.external.css';
import '../../assets/chessground/chessground.chessort.css';

export const ChessgroundBoard = ({
  fen,
  lastMove = [],
  turnColor = 'white',
  orientation = 'white',
}: ChessGroundBoardProps) => {
  const boardRef = useRef(null);
  const [api, setApi] = useState<Api>();

  // Init the board on first render
  useEffect(() => {
    if (boardRef.current) {
      const api = Chessground(boardRef.current, initialConfig);
      setApi(api);
      return () => {
        api.destroy();
      };
    }
  }, []);

  // Update board state via API
  // This essentially binds the props to the API
  useEffect(() => {
    api?.set({
      fen,
      lastMove,
      turnColor,
      orientation,
    });
  }, [api, fen, lastMove, orientation, turnColor]);

  return <ChessgroundContainer ref={boardRef}></ChessgroundContainer>;
};
