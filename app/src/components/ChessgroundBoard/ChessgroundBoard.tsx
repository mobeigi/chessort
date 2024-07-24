import { useEffect, useRef, useState } from 'react';
import { ChessgroundContainer } from './styled';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { ChessGroundBoardProps } from './types';
import { initialConfig } from './initialConfig';

import '../../../node_modules/chessground/assets/chessground.base.css';
import '../../assets/pieces/maestro/chessground.maestro.external.css';
import '../../assets/chessground/chessground.chessort.css';

export const ChessgroundBoard = ({ fen, lastMove }: ChessGroundBoardProps) => {
  const boardRef = useRef(null);
  const [api, setApi] = useState<Api>();

  // Init the board on first render
  useEffect(() => {
    if (boardRef.current) {
      const api = Chessground(boardRef.current, initialConfig);
      console.log(api);
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
      fen: fen,
      lastMove: lastMove,
    });
  }, [api, fen, lastMove]);

  return <ChessgroundContainer ref={boardRef}></ChessgroundContainer>;
};