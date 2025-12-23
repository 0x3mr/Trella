import { useReducer, useEffect } from "react";
import BoardContext from "./BoardContext";
import { boardReducer, initialState } from "./boardReducer";
import { loadState, saveState } from "../storage/storage";

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState, (init) =>
    loadState(init),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
