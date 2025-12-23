import { useBoardState } from "./useBoardState";

export function useUndoRedo() {
  const { undo, redo, state } = useBoardState();

  return {
    undo,
    redo,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
  };
}
