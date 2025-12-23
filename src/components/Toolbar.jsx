import { useUndoRedo } from "../hooks/useUndoRedo";

export default function Toolbar() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white">
      <span className="text-sm text-slate-500">
        Kanban Board
      </span>

      <div className="flex gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40"
        >
          Undo
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="px-3 py-2 rounded-lg border border-slate-200 disabled:opacity-40"
        >
          Redo
        </button>
      </div>
    </div>
  );
}
