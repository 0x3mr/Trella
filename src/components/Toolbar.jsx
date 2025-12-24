import { useBoardState } from "../hooks/useBoardState";

export default function Toolbar() {
  const { addList, undo, redo } = useBoardState();

  return (
    <nav
      className="p-2 flex gap-2 bg-white shadow"
      role="toolbar"
      aria-label="Board actions toolbar"
    >
      <button
        onClick={() => addList("New List")}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Add new list"
      >
        + List
      </button>
      <button
        onClick={undo}
        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Undo last action"
      >
        Undo
      </button>
      <button
        onClick={redo}
        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Redo last undone action"
      >
        Redo
      </button>
    </nav>
  );
}