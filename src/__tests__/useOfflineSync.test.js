import { renderHook, act, waitFor } from "@testing-library/react";
import { useOfflineSync } from "../hooks/useOfflineSync";
import * as storage from "../storage/storage";
import * as api from "../services/api";

// Mock dependencies
jest.mock("../storage/storage");
jest.mock("../services/api");

// Mock timers
jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
  storage.loadQueue.mockReturnValue([]);
  storage.saveQueue.mockImplementation(() => {});
  api.syncOperation.mockResolvedValue({ success: true });
});

afterEach(() => {
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test("enqueue adds operation to queue", () => {
  const { result } = renderHook(() => useOfflineSync());

  act(() => {
    result.current.enqueue({
      type: "ADD_CARD",
      payload: { listId: "list1", title: "Test Card" },
    });
  });

  const queue = result.current.getQueue();
  expect(queue.length).toBe(1);
  expect(queue[0].type).toBe("ADD_CARD");
});

test("getQueue returns current queue", () => {
  const { result } = renderHook(() => useOfflineSync());

  act(() => {
    result.current.enqueue({
      type: "ADD_LIST",
      payload: { title: "Test List" },
    });
  });

  const queue = result.current.getQueue();
  expect(queue.length).toBe(1);
  expect(queue[0].type).toBe("ADD_LIST");
});

test("processes queue successfully", async () => {
  api.syncOperation.mockResolvedValue({ success: true });

  const { result } = renderHook(() => useOfflineSync());

  await act(async () => {
    result.current.enqueue({
      type: "ADD_CARD",
      payload: { listId: "list1", title: "Test" },
    });
  });

  await waitFor(() => {
    expect(api.syncOperation).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(result.current.getQueue().length).toBe(0);
  });
});

test("saves queue to storage when enqueuing", () => {
  const { result } = renderHook(() => useOfflineSync());

  act(() => {
    result.current.enqueue({
      type: "ADD_CARD",
      payload: { listId: "list1", title: "Test" },
    });
  });

  expect(storage.saveQueue).toHaveBeenCalled();
});

test("loads queue from storage on mount", () => {
  const mockQueue = [
    { type: "ADD_LIST", payload: { title: "Loaded List" }, opId: 123 },
  ];
  storage.loadQueue.mockReturnValue(mockQueue);

  const { result } = renderHook(() => useOfflineSync());

  const queue = result.current.getQueue();
  expect(queue.length).toBe(1);
  expect(queue[0].type).toBe("ADD_LIST");
});

test("handles sync errors gracefully", async () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation();
  api.syncOperation.mockRejectedValue(new Error("Network error"));

  const { result } = renderHook(() => useOfflineSync());

  await act(async () => {
    result.current.enqueue({
      type: "ADD_CARD",
      payload: { listId: "list1", title: "Test" },
    });
  });

  await waitFor(() => {
    expect(consoleError).toHaveBeenCalledWith("Sync failed:", "Network error");
  });

  consoleError.mockRestore();
});

test("calls onConflict when conflict detected", async () => {
  const onConflict = jest.fn();
  api.syncOperation.mockResolvedValue({
    conflict: true,
    serverCard: { title: "Server Version" },
  });

  const { result } = renderHook(() => useOfflineSync(onConflict));

  await act(async () => {
    result.current.enqueue({
      type: "UPDATE_CARD",
      payload: { cardId: "card1", updates: { title: "Local Version" } },
      localData: { title: "Local Version" },
    });
  });

  await waitFor(() => {
    expect(onConflict).toHaveBeenCalled();
  });

  expect(onConflict.mock.calls[0][0]).toMatchObject({
    local: { title: "Local Version" },
    server: { title: "Server Version" },
  });
});

test("enqueued operation includes opId", () => {
  const { result } = renderHook(() => useOfflineSync());

  act(() => {
    result.current.enqueue({
      type: "ADD_CARD",
      payload: { listId: "list1", title: "Test" },
    });
  });

  const queue = result.current.getQueue();
  expect(queue[0].opId).toBeDefined();
  expect(typeof queue[0].opId).toBe("number");
});

test("sets up online event listener", () => {
  const addEventListenerSpy = jest.spyOn(window, "addEventListener");

  renderHook(() => useOfflineSync());

  expect(addEventListenerSpy).toHaveBeenCalledWith(
    "online",
    expect.any(Function),
  );

  addEventListenerSpy.mockRestore();
});

test("sets up interval for periodic sync", () => {
  const setIntervalSpy = jest.spyOn(global, "setInterval");

  renderHook(() => useOfflineSync());

  expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);

  setIntervalSpy.mockRestore();
});

test("cleans up listeners on unmount", () => {
  const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
  const clearIntervalSpy = jest.spyOn(global, "clearInterval");

  const { unmount } = renderHook(() => useOfflineSync());

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    "online",
    expect.any(Function),
  );
  expect(clearIntervalSpy).toHaveBeenCalled();

  removeEventListenerSpy.mockRestore();
  clearIntervalSpy.mockRestore();
});
