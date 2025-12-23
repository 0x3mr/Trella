import { useCallback } from "react";
import { useBoardState } from "./useBoardState";

export function useUndoRedo() {
  const { state, dispatch } = useBoardState();

  const undo = useCallback(() => {
    if (state.history.length === 0) return;
    dispatch({ type: "UNDO" });
  }, [state.history, dispatch]);

  const redo = useCallback(() => {
    if (state.future.length === 0) return;
    dispatch({ type: "REDO" });
  }, [state.future, dispatch]);

  return {
    undo,
    redo,
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
  };
}
