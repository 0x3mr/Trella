import { useBoardState } from "../hooks/useBoardState";
import ListColumn from "./ListColumn";

export default function Board() {
  const { state } = useBoardState();
  const { listOrder, lists } = state.board;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {listOrder.map((listId) => (
        <ListColumn key={listId} list={lists[listId]} />
      ))}

      <AddListColumn />
    </div>
  );
}

function AddListColumn() {
  const { addList } = useBoardState();

  return (
    <button
      onClick={() => addList("New List")}
      className="min-w-[280px] h-fit rounded-xl border-2 border-dashed border-slate-300
                 flex items-center justify-center text-slate-400 hover:border-violet-400"
    >
      + Add another list
    </button>
  );
}
