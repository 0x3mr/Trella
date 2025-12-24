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

  const handleAddCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addCard(list.id, "New Card");
    }
  };

  const handleArchiveKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      archiveList(list.id);
    }
  };

  return (
    <section
      ref={setNodeRef}
      className="bg-white rounded shadow w-72 p-3"
      data-testid={`list-${list.id}`}
      aria-label={`List: ${list.title}`}
      role="region"
    >
      <InlineEditor
        value={list.title}
        onSave={(t) => renameList(list.id, t)}
        ariaLabel={`Edit list title: ${list.title}`}
      />

      <SortableContext
        items={list.cards.map((c) => `${list.id}:${c.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className="space-y-2 mt-2 min-h-[20px]"
          data-testid={`list-cards-${list.id}`}
          role="list"
          aria-label={`Cards in ${list.title}`}
        >
          {list.cards.map((card) => (
            <Card key={card.id} card={card} listId={list.id} />
          ))}
        </div>
      </SortableContext>

      <button
        className="text-sm text-blue-600 mt-2 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
        data-testid={`add-card-${list.id}`}
        onClick={() => addCard(list.id, "New Card")}
        onKeyDown={handleAddCardKeyDown}
        aria-label={`Add new card to ${list.title}`}
      >
        + Add card
      </button>

      <button
        className="text-sm text-red-600 mt-1 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
        data-testid={`archive-list-${list.id}`}
        onClick={() => archiveList(list.id)}
        onKeyDown={handleArchiveKeyDown}
        aria-label={`Archive list ${list.title}`}
      >
        Archive list
      </button>
    </section>
  );
}
