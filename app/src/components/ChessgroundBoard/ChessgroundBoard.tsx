import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ChessgroundContainer } from './styled';
import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { ChessGroundBoardProps } from './types';
import { initialConfig } from './initialConfig';

import '../../assets/chessground/chessground.base.css';
import '../../assets/pieces/maestro/chessground.maestro.external.css';
import '../../assets/chessground/chessground.chessort.css';

export const ChessgroundBoard = forwardRef<Api | undefined, ChessGroundBoardProps>(
  ({ fen, lastMove = [], turnColor = 'white', orientation = 'white' }: ChessGroundBoardProps, apiRef) => {
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
      if (api) {
        console.log(api.state.drawable.shapes);
        api.set({
          fen,
          lastMove,
          turnColor,
          orientation,
          drawable: {
            ...api.state.drawable,
          },
        });
      }
    }, [api, fen, lastMove, turnColor, orientation]);

    // Expose API ref to parent
    useImperativeHandle(apiRef, () => api, [api]);

    return <ChessgroundContainer ref={boardRef}></ChessgroundContainer>;
  },
);
