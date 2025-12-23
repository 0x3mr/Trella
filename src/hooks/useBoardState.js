import { useContext } from "react";
import { BoardContext } from "../context/BoardProvider";
import { useOfflineSync } from "./useOfflineSync";

export function useBoardState() {
  const { state, dispatch } = useContext(BoardContext);
  const { enqueue } = useOfflineSync();

  function optimisticDispatch(action, serverPayload) {
    dispatch(action);
    enqueue({
      type: action.type,
      payload: serverPayload ?? action.payload,
      timestamp: Date.now(),
    });
  }

  return {
    state,

    addList: (title) =>
      optimisticDispatch({ type: "ADD_LIST", payload: title }, { title }),

    renameList: (id, title) =>
      optimisticDispatch({ type: "RENAME_LIST", payload: { id, title } }),

    archiveList: (id) =>
      optimisticDispatch({ type: "ARCHIVE_LIST", payload: id }),

    addCard: (listId, title) =>
      optimisticDispatch({ type: "ADD_CARD", payload: { listId, title } }),

    updateCard: (listId, cardId, updates) =>
      optimisticDispatch({
        type: "UPDATE_CARD",
        payload: { listId, cardId, updates },
      }),

    deleteCard: (listId, cardId) =>
      optimisticDispatch({
        type: "DELETE_CARD",
        payload: { listId, cardId },
      }),

    moveCard: (payload) => optimisticDispatch({ type: "MOVE_CARD", payload }),

    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
  };
}
