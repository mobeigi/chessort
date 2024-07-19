import { PanelContainer, DescriptionWrapper, CardsWrapper } from './styled';
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

const Panel = () => {
  const { state, dispatch } = useGameContext();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  return (
    <PanelContainer>
      <DescriptionWrapper>
        <p>
          <strong>Puzzle: </strong> TODO
        </p>
        <p>
          <strong>Difficulty: </strong> Hidden
        </p>
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
              <Card key={moveDetail.uciMove} moveDetail={moveDetail} />
            ))}
          </SortableContext>
        </DndContext>
      </CardsWrapper>

      <button>Submit</button>
    </PanelContainer>
  );
};

export default Panel;
