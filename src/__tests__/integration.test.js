import { boardReducer, initialState } from "../context/boardReducer";
import { renderHook, act } from "@testing-library/react";
import { useOfflineSync } from "../hooks/useOfflineSync";
import * as api from "../services/api";

jest.mock("../services/api");

test("offline sync updates reducer state", async () => {
  let state = { ...initialState };
  const addListAction = { type: "ADD_LIST", payload: "Todo" };
  state = boardReducer(state, addListAction);

  api.syncOperation.mockResolvedValue({});
  const { result } = renderHook(() => useOfflineSync());

  act(() => {
    result.current.enqueue(addListAction);
  });

  await new Promise((r) => setTimeout(r, 10));

  expect(result.current.getQueue()).toHaveLength(0);
});
