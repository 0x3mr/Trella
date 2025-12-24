import { useBoardState } from "../hooks/useBoardState";
import Card from "./Card";
import InlineEditor from "./InlineEditor";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

export default function ListColumn({ list }) {
  const { addCard, renameList, archiveList } = useBoardState();

  const { setNodeRef } = useDroppable({
    id: list.id, // list itself is droppable
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white rounded shadow w-72 p-3"
      data-testid={`list-${list.id}`}
    >
      <InlineEditor value={list.title} onSave={(t) => renameList(list.id, t)} />
      <SortableContext
        items={list.cards.map((c) => `${list.id}:${c.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className="space-y-2 mt-2 min-h-[20px]"
          data-testid={`list-cards-${list.id}`}
        >
          {list.cards.map((card) => (
            <Card key={card.id} card={card} listId={list.id} />
          ))}
        </div>
      </SortableContext>
      <button
        className="text-sm text-blue-600 mt-2"
        data-testid={`add-card-${list.id}`}
        onClick={() => addCard(list.id, "New Card")}
      >
        + Add card
      </button>
      <button
        className="text-sm text-red-600 mt-1"
        data-testid={`archive-list-${list.id}`}
        onClick={() => archiveList(list.id)}
      >
        Archive list
      </button>
    </div>
  );
}
