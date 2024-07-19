import { useState } from "react";
import { PanelContainer, DescriptionWrapper, CardsWrapper } from './styled';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Card } from './Card';
import { CardDetails } from './Card/types';

const initCardDetails: CardDetails[] = [
  { 
    uciMove: 'e2e4', 
    sanMove: 'e4', 
    curRank: 1, 
    revealed: true,
    evalResults: {
      rank: 1,
      engineEval: '+265', 
      engineOverallRank: 1
    }
  },
  { 
    uciMove: 'd2d4', 
    sanMove: 'd4', 
    curRank: 2, 
    revealed: true,
    evalResults: {
      rank: 2,
      engineEval: '-1651', 
      engineOverallRank: 2
    }
  },
  { 
    uciMove: 'g1f3', 
    sanMove: 'h7h8=N', 
    curRank: 3, 
    revealed: true,
    evalResults: {
      rank: 2,
      engineEval: '#4', 
      engineOverallRank: 4
    }
  },
  { 
    uciMove: 'c2c4', 
    sanMove: 'c4', 
    curRank: 4, 
    revealed: false 
  },
];

const Panel = () => {
  const [cardDetails, setCardDetails] = useState(initCardDetails);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCardDetails((cardDetails) => {
        const oldIndex = cardDetails.findIndex(card => card.uciMove === active.id);
        const newIndex = over ? cardDetails.findIndex(card => card.uciMove === over.id) : oldIndex;

        // Keep curRank updated to position in list
        const newCards = arrayMove(cardDetails, oldIndex, newIndex).map((cardDetail, index) => ({
          ...cardDetail,
          curRank: index + 1
        }));

        return newCards;
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
          <SortableContext items={cardDetails.map(card => card.uciMove)} strategy={verticalListSortingStrategy}>
            {cardDetails.map((cardDetail) => (
              <Card key={cardDetail.uciMove} cardDetail={cardDetail} />
            ))}
          </SortableContext>
        </DndContext>
      </CardsWrapper>

      <button>Submit</button> 
    </PanelContainer>
  )
}

export default Panel
