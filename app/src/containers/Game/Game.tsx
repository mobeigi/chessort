import { useCallback, useEffect, useRef, useState } from 'react';
import { GameWrapper, ChessBoardWrapper, PanelWrapper } from './styled';
import ChessGroundBoard from '../../components/ChessgroundBoard';
import Panel from '../Panel';
import { useGameContext } from '../../hooks/useGameContext';
import { Key, Color } from 'chessground/types';
import useUserPreferences from '../../hooks/useUserPreferences';
import { BoardOrientation } from '../../context/userPreferencesContext';
import { Color as ChessJsColor } from 'chess.js';
import { Api } from 'chessground/api';
import { DrawShape } from 'chessground/draw';

const chessJsTurnToColor = (turnColor: ChessJsColor): Color => {
  return turnColor === 'w' ? 'white' : 'black';
};

const getBoardOrientation = (boardOrientation: BoardOrientation, turnColor: ChessJsColor): Color => {
  const turnOrientation = turnColor === 'w' ? 'white' : 'black';

  switch (boardOrientation) {
    case BoardOrientation.Turn:
      return chessJsTurnToColor(turnColor);
    case BoardOrientation.White:
      return 'white';
    case BoardOrientation.Black:
      return 'black';
    default:
      console.error('Unknown board orientation:', boardOrientation);
      return turnOrientation; // fallback
  }
};

export const Game = () => {
  const { state } = useGameContext();
  const { boardOrientation } = useUserPreferences();

  const stateRef = useRef<typeof state | null>(state);
  const apiRef = useRef<Api>();

  const [lastPreviewedMove, setLastPreviewedMove] = useState<string | null>(state.previewedMove);
  const [shapes, setShapes] = useState<Map<string | null, DrawShape[]>>(new Map());

  /**
   * Store a ref to our state for callbacks.
   */
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Reset shapes on Fen change.
   */
  useEffect(() => {
    if (apiRef.current) {
      setLastPreviewedMove(state.previewedMove);
      setShapes(new Map());
      apiRef.current.setShapes([]);
      apiRef.current.redrawAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef.current, state.gameDetails.fen]);

  /**
   * Called when shapes are updated via user interaction.
   */
  const onShapesChanged = useCallback((shapes: DrawShape[]) => {
    if (stateRef.current) {
      const previewedMove = stateRef.current.previewedMove;
      setShapes((prevShapes) => {
        const updatedShapes = new Map(prevShapes);
        updatedShapes.set(previewedMove, shapes);
        return updatedShapes;
      });
    }
  }, []);

  /**
   * Set shapes onChange handler once as api ref becomes available.
   */
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.state.drawable.onChange = onShapesChanged;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef.current]);

  /**
   * Load stored shapes as previewed move changes.
   */
  useEffect(() => {
    if (apiRef.current) {
      if (state.previewedMove !== lastPreviewedMove) {
        if (shapes) {
          const storedShapes = shapes.get(state.previewedMove);
          if (storedShapes) {
            apiRef.current.setShapes(storedShapes);
          } else {
            apiRef.current.setShapes([]);
          }
          apiRef.current.redrawAll();
        }
        setLastPreviewedMove(state.previewedMove);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef.current, state.previewedMove, lastPreviewedMove]);

  const lastMoveFrom = state.previewedMove?.slice(0, 2) as Key;
  const lastMoveTo = state.previewedMove?.slice(2, 4) as Key;
  const lastMove = [...(lastMoveFrom && lastMoveTo ? [lastMoveFrom, lastMoveTo] : [])];

  // Set orientation based on user preference
  const orientation: Color = getBoardOrientation(boardOrientation, state.initialChessJs.turn());

  return (
    <GameWrapper>
      <ChessBoardWrapper>
        <ChessGroundBoard
          ref={apiRef}
          fen={state.curChessJs.fen()}
          turnColor={chessJsTurnToColor(state.initialChessJs.turn())}
          lastMove={lastMove}
          orientation={orientation}
        />
      </ChessBoardWrapper>
      <PanelWrapper>
        <Panel />
      </PanelWrapper>
    </GameWrapper>
  );
};
