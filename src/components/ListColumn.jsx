import { useBoardState } from "../hooks/useBoardState";
import Card from "./Card";

export default function ListColumn({ list }) {
  const { state, moveCard, addCard } = useBoardState();
  const cards = list.cardIds.map((id) => state.board.cards[id]);

  function onDrop(e, toIndex) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    moveCard({
      cardId: data.cardId,
      fromListId: data.fromListId,
      toListId: list.id,
      fromIndex: data.fromIndex,
      toIndex,
    });
  }

  return (
    <div className="min-w-[280px] bg-white rounded-xl border border-slate-200 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-900">{list.title}</div>

      <div className="flex flex-col p-3 gap-1">
        {cards.map((card, index) => (
          <div key={card.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, index)}>
            <Card card={card} index={index} listId={list.id} />
          </div>
        ))}

        <div className="h-6" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, cards.length)} />
      </div>

      <button
        onClick={() => addCard(list.id, "New Card")}
        className="px-4 py-2 text-left text-sm text-violet-600 hover:bg-violet-50 rounded-b-xl mt-2"
      >
        + Add Card
      </button>
    </div>
  );
}
