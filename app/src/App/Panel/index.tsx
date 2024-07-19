import { PanelContainer, DescriptionWrapper, CardsWrapper } from './styled';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
      const oldIndex = state.cardDetails.findIndex(card => card.uciMove === active.id);
      const newIndex = over ? state.cardDetails.findIndex(card => card.uciMove === over.id) : oldIndex;

      // Keep curRank updated to position in list
      const newCardDetails = arrayMove(state.cardDetails, oldIndex, newIndex).map((cardDetail, index) => ({
        ...cardDetail,
        curRank: index + 1
      }));

      dispatch({ type: 'UPDATE_CARD_DETAILS', payload: newCardDetails });
    }
  };

  return (
    <PanelContainer>
      <DescriptionWrapper>
        <p><strong>Puzzle: </strong> TODO</p>
        <p><strong>Difficulty: </strong> Hidden</p>
      </DescriptionWrapper>

      <CardsWrapper>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
          <SortableContext items={state.cardDetails.map(card => card.uciMove)} strategy={verticalListSortingStrategy}>
            {state.cardDetails.map((cardDetail) => (
              <Card key={cardDetail.uciMove} cardDetail={cardDetail} />
            ))}
          </SortableContext>
        </DndContext>
      </CardsWrapper>

      <button>Submit</button> 
    </PanelContainer>
  )
}

export default Panel;
