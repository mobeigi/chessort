import { useEffect, useCallback } from 'react';
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
import { Card } from './Card';
import { useGameContext } from '../../common/hooks';
import { Description } from './Description';
import { uciMoveToSanMove, getTurnPlayerColor } from '../../utils/chessJsUtils';
import { MoveDetail } from '../../context/types';
import { getNewRandomGame, getGameSolution } from '../../common/api';

// Returns all correct ranks for a card which can then be used to compute correctness in ordering
const computeCorrectRanks = (solutionEvals: string[], moveDetail: MoveDetail) => {
  return solutionEvals
    .map((item, index) => (item === moveDetail.evalResult?.engineEval ? index + 1 : -1)) // offset index to start at 1
    .filter((index) => index !== -1);
};

const Panel = () => {
  const { state, dispatch } = useGameContext();

  // Function to load a new game
  const loadNewGame = useCallback(async () => {
    let data;
    try {
      data = await getNewRandomGame();
    } catch (error) {
      console.error('Error fetching new game data:', error);
    } finally {
      if (data !== undefined) {
        dispatch({
          type: 'NEW_GAME',
          payload: {
            fen: data.fen,
            uciMoves: data.uciMoves,
            difficulty: data.difficulty,
          },
        });
      }
    }
  }, [dispatch]);

  const revealSolutionForCurrentGame = useCallback(async () => {
    if (state.isPreview) {
      // Exit preview if we're in preview as we submit
      dispatch({ type: 'UNPREVIEW_MOVE' });
    }

    try {
      const data = await getGameSolution(
        state.gameDetails.fen,
        state.moveDetails.map((moveDetail) => moveDetail.uciMove),
      );
      // Dispatch action to update state with new game data
      dispatch({
        type: 'UPSERT_SOLUTION',
        payload: data,
      });
    } catch (error) {
      console.error('Error getting game solution data:', error);
    } finally {
      dispatch({ type: 'REVEAL_MOVES' });
    }
  }, [dispatch, state.gameDetails.fen, state.isPreview, state.moveDetails]);

  // The initial loading of the first game
  useEffect(() => {
    loadNewGame();
  }, [loadNewGame]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 } /* To allow onClick events */,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleClick = useCallback(
    (uciMove: string) => {
      // If any move is currently previewed, unpreview it
      if (state.isPreview) {
        dispatch({ type: 'UNPREVIEW_MOVE' });
      }
      // Preview the clicked move if it is not the same as the current previewed move
      // If the clicked move is the same as the current previewed move, it will be unpreviewed in the prior action
      if (state.previewedMove !== uciMove) {
        dispatch({ type: 'PREVIEW_MOVE', payload: uciMove });
      }
    },
    [state.isPreview, state.previewedMove, dispatch],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const moveDetail = state.moveDetails.find((card) => card.uciMove === active.id);

    // Unpreview other moves
    if (state.isPreview) {
      dispatch({ type: 'UNPREVIEW_MOVE' });
    }
    dispatch({ type: 'PREVIEW_MOVE', payload: moveDetail?.uciMove });
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

  const handleSubmit = () => revealSolutionForCurrentGame();
  const handleNextPuzzle = () => loadNewGame();

  const turnPlayer = getTurnPlayerColor(state.initialChessJs);

  return (
    <PanelContainer>
      <DescriptionWrapper>
        <Description />
      </DescriptionWrapper>

      <CardsWrapper>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext items={state.moveDetails.map((card) => card.uciMove)} strategy={verticalListSortingStrategy}>
            {state.moveDetails.map((moveDetail) => (
              <Card
                key={moveDetail.uciMove}
                moveDetail={moveDetail}
                turnPlayer={turnPlayer}
                sanMove={uciMoveToSanMove(state.initialChessJs, moveDetail.uciMove)!}
                revealed={state.gameDetails.revealed}
                correctRanks={computeCorrectRanks(state.solutionEvals, moveDetail)}
                onClick={handleClick}
                isPreviewed={state.previewedMove === moveDetail.uciMove}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardsWrapper>
      {state.gameDetails.revealed ? (
        <NextButton onClick={handleNextPuzzle}>Next Puzzle</NextButton>
      ) : (
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      )}
    </PanelContainer>
  );
};

export default Panel;
