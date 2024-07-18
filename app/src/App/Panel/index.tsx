import { useState } from "react";
import { PanelContainer, DescriptionWrapper, CardsWrapper } from './styled';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Card } from './Card';

const initialItems = ['Card 1', 'Card 2', 'Card 3', 'Card 4'];

const Panel = () => {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = over ? items.indexOf(over.id as string) : oldIndex;

        return arrayMove(items, oldIndex, newIndex);
      });
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
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <Card key={item} id={item} />
            ))}
          </SortableContext>
        </DndContext>
      </CardsWrapper>

      <button>Submit</button> 
    </PanelContainer>
  )
}

export default Panel
