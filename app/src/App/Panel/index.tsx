import { useCallback } from 'react';
import { PanelContainer, DescriptionWrapper, CardsWrapper, SubmitButton, NextButton } from './styled';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Card } from './Card';
import { useGameContext } from '../../context/gameContext';
import { Description } from './Description';
import { uciMoveToSanMove, getTurnPlayerColor } from '../../utils/chessJsUtils';
import { MoveDetail } from '../../context/types';
import { getNewRandomGame } from '../../common/api';

// Returns all correct ranks for a card which can then be used to compute correctness in ordering
const computeCorrectRanks = (solutionEvals: string[], moveDetail: MoveDetail) => {
  return solutionEvals
    .map((item, index) => (item === moveDetail.evalResult?.engineEval ? index + 1 : -1)) // offset index to start at 1
    .filter((index) => index !== -1);
};

const Panel = () => {
  const { state, dispatch } = useGameContext();

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
      if (state.isPreview) {
        dispatch({ type: 'UNPREVIEW_MOVE' });
      } else {
        dispatch({ type: 'PREVIEW_MOVE', payload: uciMove });
      }
    },
    [state.isPreview, dispatch],
  );

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

  const handleSubmit = () => {
    if (state.isPreview) {
      // Exit preview if we're in preview as we submit
      dispatch({ type: 'UNPREVIEW_MOVE' });
    }
    dispatch({ type: 'REVEAL_MOVES' });
  };

  const handleNextPuzzle = async () => {
    try {
      const data = await getNewRandomGame();

      // Dispatch action to update state with new game data
      dispatch({
        type: 'NEW_GAME',
        payload: {
          fen: data.fen,
          uciMoves: data.uciMoves,
          difficulty: data.difficulty,
        },
      });
    } catch (error) {
      console.error('Error fetching new game data:', error);
    }
  };

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
