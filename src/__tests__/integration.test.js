import { boardReducer, initialState } from "../context/boardReducer";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useOfflineSync } from "../hooks/useOfflineSync";
import * as api from "../services/api";
import * as storage from "../storage/storage";

jest.mock("../services/api");
jest.mock("../storage/storage");

describe("Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.loadQueue.mockReturnValue([]);
    storage.saveQueue.mockImplementation(() => {});
    api.syncOperation.mockResolvedValue({ success: true });
  });

  test("offline sync updates reducer state", async () => {
    let state = { ...initialState };
    const addListAction = { type: "ADD_LIST", payload: "Todo" };
    state = boardReducer(state, addListAction);

    // Mock successful sync operation
    api.syncOperation.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useOfflineSync());

    // Enqueue the operation
    act(() => {
      result.current.enqueue(addListAction);
    });

    // Wait for the queue to be processed
    await waitFor(
      () => {
        expect(result.current.getQueue()).toHaveLength(0);
      },
      { timeout: 2000 },
    );

    // Verify sync was called
    expect(api.syncOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ADD_LIST",
        payload: "Todo",
      }),
    );
  });
});
