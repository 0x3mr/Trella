import { useBoardState } from "../hooks/useBoardState";

export default function Toolbar() {
  const { addList, undo, redo } = useBoardState();

  return (
    <div className="p-2 flex gap-2 bg-white shadow">
      <button onClick={() => addList("New List")}>+ List</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
}
