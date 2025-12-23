import { useContext, useCallback } from "react";
import { BoardContext } from "../context/BoardProvider";
import { ActionTypes } from "../context/boardReducer";
import { v4 as uuid } from "uuid";

export function useBoardState() {
  const { state, dispatch } = useContext(BoardContext);

  const addList = useCallback(
    (title) => dispatch({ type: ActionTypes.ADD_LIST, payload: { title } }),
    [dispatch]
  );

    const addCard = useCallback((listId, title) => {
    const id = uuid();
    dispatch({ type: ActionTypes.ADD_CARD, payload: { listId, title, id } });
    }, [dispatch]);

  const moveCard = useCallback((payload) => dispatch({ type: ActionTypes.MOVE_CARD, payload }), [dispatch]);

  const undo = useCallback(() => dispatch({ type: ActionTypes.UNDO }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: ActionTypes.REDO }), [dispatch]);

  return { state, addList, addCard, moveCard, undo, redo };
}
