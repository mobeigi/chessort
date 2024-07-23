import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
import { uciMoveToSanMove, getTurnPlayerColor } from '../../utils/chessJsUtils';
import { MoveDetail } from '../../context/gameContext/types';
import { useLoadGame } from '../../hooks/useLoadGame';
import { useRevealSolution } from '../../hooks/useRevealSolution';
import { useNavigate } from 'react-router-dom';
import { GameApiResponse } from '../../services/chessortServer';
import ClipLoader from 'react-spinners/ClipLoader';

// Returns all correct ranks for a card which can then be used to compute correctness in ordering
// A card can have 1 or many correct ranks depending on if the number of equivilanet solution evaluations
const computeCorrectRanks = (solutionEvals: string[], moveDetail: MoveDetail) => {
  return solutionEvals
    .map((item, index) => (item === moveDetail.evalResult?.engineEval ? index + 1 : -1)) // offset index to start at 1
    .filter((index) => index !== -1);
};

export const Panel = () => {
  const { state, dispatch } = useGameContext();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId?: string }>();

  const onLoadGameSuccess = useCallback(
    (game: GameApiResponse) => {
      // Populate browser navigation history
      navigate(`/puzzle/${game.gameId}`);
    },
    [navigate],
  );

  const onRevealSolutionSuccess = useCallback(() => {
    // Unpreview upon revealing the solution
    dispatch({ type: 'UNPREVIEW_MOVE' });
  }, [dispatch]);

  const { loadGame } = useLoadGame({
    onSuccess: onLoadGameSuccess,
  });

  const { revealSolution } = useRevealSolution({
    onSuccess: onRevealSolutionSuccess,
  });

  // The initial loading of the first game
  useEffect(() => {
    if (!state.isInitialLoadCompleted) {
      const loadGameAndSetInitialLoadCompleted = async () => {
        await loadGame(gameId);
        dispatch({ type: 'SET_INITIAL_LOAD_COMPLETED', payload: true });
      };
      loadGameAndSetInitialLoadCompleted();
    }
  }, [dispatch, gameId, loadGame, state.isInitialLoadCompleted]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 } /* To allow onClick events */,
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

  // Loading state for initial load
  if (!state.isInitialLoadCompleted) {
    return (
      <PanelContainer>
        <ClipLoader color="#ccc" />
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <DescriptionWrapper>
        <Description gameId={state.gameDetails.gameId} difficulty={state.gameDetails.difficulty} />
      </DescriptionWrapper>

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
          {state.isLoadingGame ? <ClipLoader color="#666666" size={20} /> : <span>Next Puzzle</span>}
        </NextButton>
      ) : (
        <SubmitButton onClick={handleSubmit} disabled={state.isLoadingSolution}>
          {state.isLoadingSolution ? <ClipLoader color="#666666" size={20} /> : <span>Submit</span>}
        </SubmitButton>
      )}
    </PanelContainer>
  );
};
