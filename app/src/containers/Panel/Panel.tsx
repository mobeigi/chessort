import { useEffect, useCallback, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { PanelContainer, DescriptionWrapper, CardsWrapper, SubmitButton, NextButton } from './styled';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import Card from './Card';
import { useGameContext } from '../../hooks/useGameContext';
import Description from './Description';
import { uciMoveToSanMove, getTurnPlayerColor } from '../../utils/chessUtils';
import { MoveDetail } from '../../context/gameContext/types';
import { useLoadGame } from '../../hooks/useLoadGame';
import { useRevealSolution } from '../../hooks/useRevealSolution';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useTheme } from 'styled-components';
import ActionBar from './ActionBar';
import confetti from 'canvas-confetti';
import { toast, TypeOptions } from 'react-toastify';
import { ThemeMode } from '../../types/theme';

// TODO: Both below functions should be in some sort of game utils file
// Returns all correct ranks for a card which can then be used to compute correctness in ordering
// A card can have 1 or many correct ranks depending on if the number of equivilanet solution evaluations
const computeCorrectRanks = (solutionEvals: string[], moveDetail: MoveDetail) => {
  return solutionEvals
    .map((item, index) => (item === moveDetail.evalResult?.engineEval ? index + 1 : -1)) // offset index to start at 1
    .filter((index) => index !== -1);
};

const isSolutionCorrect = (solutionEvals: string[], moveDetails: MoveDetail[]) => {
  if (solutionEvals.length !== 4 || moveDetails.length !== 4) {
    return false;
  }
  return moveDetails.every((moveDetail) => {
    const correctRanks = computeCorrectRanks(solutionEvals, moveDetail);
    return correctRanks.includes(moveDetail.curRank);
  });
};

// TODO: comonise the toasts
const showToast = (message: string, type: TypeOptions, themeMode: ThemeMode) => {
  toast.info(message, {
    position: 'bottom-left',
    autoClose: 2000,
    type,
    theme: themeMode,
  });
};

export const Panel = () => {
  const { state, dispatch } = useGameContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const { loadGame, game, loading, error } = useLoadGame();
  const { revealSolution, loading: solutionLoading, error: solutionError } = useRevealSolution();

  const { gameId } = useParams<{ gameId?: string }>();
  const [lastLocation, setLastLocation] = useState(location.pathname);

  // We have special states to track the initial loading / failure
  const [isInitLoadAttempted, setIsInitLoadAttempted] = useState(false);
  const [isInitLoadCompleted, setIsInitLoadCompleted] = useState(false);
  const [initError, setInitError] = useState(false);

  /**
   * Populate browser navigation.
   * To support back/forward browser navigation.
   */
  useEffect(() => {
    const targetPathname = game ? `/puzzle/${game.gameId}` : '';
    if (game?.gameId && location.pathname !== targetPathname) {
      // Populate browser navigation history
      navigate(`/puzzle/${game.gameId}`);
    }
    // Only fire when gameId changes (indicating fresh game just loaded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.gameId]);

  /**
   * Load the inital game.
   */
  useEffect(() => {
    if (!isInitLoadAttempted) {
      loadGame(gameId);
      setIsInitLoadAttempted(true);
    }

    if (isInitLoadAttempted && !isInitLoadCompleted && !loading) {
      setInitError(error);
      setIsInitLoadCompleted(true);
    }
  }, [isInitLoadAttempted, loadGame, gameId, isInitLoadCompleted, loading, error]);

  /**
   * Load a new game whenever the location pathname changes.
   */
  useEffect(() => {
    if (location.pathname !== lastLocation) {
      const puzzleIdInUrl = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
      if (state.gameDetails.gameId !== puzzleIdInUrl) {
        loadGame(puzzleIdInUrl);
      }
      setLastLocation(location.pathname);
    }
  }, [location, lastLocation, state.gameDetails.gameId, loadGame]);

  /**
   * Trigger error toasts for errors
   */
  useEffect(() => {
    if (!loading && error) {
      showToast('Failed to load game.', 'error', ThemeMode.Dark);
    }
  }, [dispatch, error, loading]);

  useEffect(() => {
    if (!solutionLoading && solutionError) {
      showToast('Failed to load solution.', 'error', ThemeMode.Dark);
    }
  }, [dispatch, solutionError, solutionLoading]);

  /**
   * On reveal
   */
  useEffect(() => {
    if (state.revealed && !solutionLoading && !solutionError) {
      // Unpreview upon revealing the solution
      dispatch({ type: 'UNPREVIEW_MOVE' });
    }
  }, [dispatch, solutionError, solutionLoading, state.revealed]);

  /**
   * Spawn confetti on correct solution
   */
  useEffect(() => {
    if (isSolutionCorrect(state.solutionEvals, state.moveDetails)) {
      confetti({
        particleCount: 300,
        spread: 500,
        angle: 90,
        startVelocity: 40,
        gravity: 0.7,
        ticks: 100,
        origin: { x: 0.5, y: 0.5 },
        disableForReducedMotion: true,
      });
    }
  }, [state.moveDetails, state.solutionEvals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 } /* To allow onClick events */,
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 4 } /* Mobile support */,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleCardClick = useCallback(
    (uciMove: string) => {
      dispatch({ type: 'UNPREVIEW_MOVE' });

      // Preview the clicked move if it is not the same as the current previewed move
      // If the clicked move is the same as the current previewed move, it will be unpreviewed in the prior action
      if (state.previewedMove !== uciMove) {
        dispatch({ type: 'PREVIEW_MOVE', payload: uciMove });
      }
    },
    [state.previewedMove, dispatch],
  );

  const handleCardDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const moveDetail = state.moveDetails.find((card) => card.uciMove === active.id);

    // Unpreview other moves
    dispatch({ type: 'UNPREVIEW_MOVE' });
    dispatch({ type: 'PREVIEW_MOVE', payload: moveDetail?.uciMove });
  };

  const handleCardDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = state.moveDetails.findIndex((card) => card.uciMove === active.id);
      const newIndex = over ? state.moveDetails.findIndex((card) => card.uciMove === over.id) : oldIndex;

      // Keep curRank updated to position in list
      const newMoveDetails = arrayMove(state.moveDetails, oldIndex, newIndex).map((moveDetail, index) => ({
        ...moveDetail,
        curRank: index + 1,
      }));

      dispatch({ type: 'UPDATE_MOVE_DETAILS', payload: newMoveDetails });
    }
  };

  const handleSubmit = () => revealSolution();
  const handleNextPuzzle = () => loadGame();

  const turnPlayer = getTurnPlayerColor(state.initialChessJs);

  // Initial loading state
  if (!isInitLoadCompleted) {
    return (
      <PanelContainer>
        <ClipLoader color={theme.colors.status.disabled.baseHighlight} />
      </PanelContainer>
    );
  }

  // Initial loading resulted in error state
  if (isInitLoadCompleted && initError) {
    return (
      <PanelContainer>
        <div>
          <i className="bx bx-error"></i> <span>Failed to load game.</span>
        </div>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <DescriptionWrapper>
        <Description gameId={state.gameDetails.gameId} difficulty={state.gameDetails.difficulty} />
      </DescriptionWrapper>

      <ActionBar fen={state.gameDetails.fen} />

      <CardsWrapper>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleCardDragStart}
          onDragEnd={handleCardDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={state.moveDetails.map((card) => card.uciMove)}
            strategy={verticalListSortingStrategy}
            disabled={state.isLoadingSolution || state.revealed}
          >
            {state.moveDetails.map((moveDetail) => (
              <Card
                key={moveDetail.uciMove}
                moveDetail={moveDetail}
                turnPlayer={turnPlayer}
                sanMove={uciMoveToSanMove(state.initialChessJs, moveDetail.uciMove) ?? ''}
                revealed={state.revealed}
                correctRanks={computeCorrectRanks(state.solutionEvals, moveDetail)}
                onClick={handleCardClick}
                isPreviewed={state.previewedMove === moveDetail.uciMove}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardsWrapper>
      {state.revealed ? (
        <NextButton onClick={handleNextPuzzle} disabled={state.isLoadingGame}>
          {state.isLoadingGame ? (
            <ClipLoader size={'1em'} color={theme.colors.status.disabled.baseHighlight} />
          ) : (
            <span>Next Puzzle</span>
          )}
        </NextButton>
      ) : (
        <SubmitButton onClick={handleSubmit} disabled={state.isLoadingSolution}>
          {state.isLoadingSolution ? (
            <ClipLoader size={'1em'} color={theme.colors.status.disabled.baseHighlight} />
          ) : (
            <span>Submit</span>
          )}
        </SubmitButton>
      )}
    </PanelContainer>
  );
};
