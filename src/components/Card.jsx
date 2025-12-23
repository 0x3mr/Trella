import { memo } from "react";

function Card({ card, index, listId }) {
  function onDragStart(e) {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ cardId: card.id, fromListId: listId, fromIndex: index })
    );
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 cursor-grab hover:shadow-md transition"
    >
      <h3 className="font-medium text-slate-800">{card.title}</h3>
      {card.description && <p className="text-sm text-slate-500 mt-1">{card.description}</p>}
      {card.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map((tag) => (
            <span key={tag} className="text-xs bg-violet-100 text-violet-800 px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(Card);
