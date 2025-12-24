import { createContext, useReducer, useEffect } from "react";
import { boardReducer, initialState } from "./boardReducer";
import { loadState, saveState } from "../storage/storage";

export const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
