import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useBoardState } from "../hooks/useBoardState";
import ListColumn from "./ListColumn";

export default function Board() {
  const { state, moveCard } = useBoardState();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // prevents click from starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragEnd({ active, over }) {
    if (!over) return;

    const [fromListId, cardId] = active.id.split(":");

    // Dropped on a card
    if (over.id.includes(":")) {
      const [toListId, targetCardId] = over.id.split(":");

      const targetList = state.lists.find((l) => l.id === toListId);
      if (!targetList) return;

      const targetIndex = targetList.cards.findIndex(
        (c) => c.id === targetCardId,
      );

      moveCard({
        fromList: fromListId,
        toList: toListId,
        cardId,
        toIndex: targetIndex,
      });
      return;
    }

    // Dropped on list container
    const toListId = over.id;
    const targetList = state.lists.find((l) => l.id === toListId);
    if (!targetList) return;

    moveCard({
      fromList: fromListId,
      toList: toListId,
      cardId,
      toIndex: targetList.cards.length,
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => {
            const [listId, cardId] = active.id.split(":");
            return `Picked up card ${cardId} from list ${listId}`;
          },
          onDragOver: ({ active, over }) => {
            if (over) {
              return `Card is now over ${over.id}`;
            }
            return undefined;
          },
          onDragEnd: ({ active, over }) => {
            if (over) {
              return `Card ${active.id} was dropped over ${over.id}`;
            }
            return `Card ${active.id} was dropped`;
          },
          onDragCancel: ({ active }) => {
            return `Dragging was cancelled. Card ${active.id} was not moved.`;
          },
        },
      }}
    >
      <main
        role="main"
        aria-label="Kanban board"
        className="flex gap-4 p-4 overflow-x-auto"
      >
        {state.lists
          .filter((l) => !l.archived)
          .map((list) => (
            <ListColumn key={list.id} list={list} />
          ))}
      </main>
    </DndContext>
  );
}