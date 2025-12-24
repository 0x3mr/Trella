import { renderHook, act } from "@testing-library/react";
import { useBoardState } from "../hooks/useBoardState";
import { BoardProvider } from "../context/BoardProvider";
import * as useOfflineSyncModule from "../hooks/useOfflineSync";

// Mock useOfflineSync
jest.mock("../hooks/useOfflineSync");

const mockEnqueue = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useOfflineSyncModule.useOfflineSync.mockReturnValue({
    enqueue: mockEnqueue,
    getQueue: jest.fn(() => []),
  });
});

const wrapper = ({ children }) => <BoardProvider>{children}</BoardProvider>;

test("returns state from context", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  expect(result.current.state).toBeDefined();
  expect(result.current.state.lists).toBeDefined();
});

test("addList dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.addList("New List");
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "ADD_LIST",
      payload: { title: "New List" },
    }),
  );
});

test("renameList dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.renameList("list1", "Updated Title");
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "RENAME_LIST",
      payload: { id: "list1", title: "Updated Title" },
    }),
  );
});

test("archiveList dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.archiveList("list1");
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "ARCHIVE_LIST",
      payload: "list1",
    }),
  );
});

test("addCard dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.addCard("list1", "New Card");
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "ADD_CARD",
      payload: { listId: "list1", title: "New Card" },
    }),
  );
});

test("updateCard dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.updateCard("list1", "card1", { title: "Updated" });
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "UPDATE_CARD",
      payload: {
        listId: "list1",
        cardId: "card1",
        updates: { title: "Updated" },
      },
    }),
  );
});

test("deleteCard dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.deleteCard("list1", "card1");
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "DELETE_CARD",
      payload: { listId: "list1", cardId: "card1" },
    }),
  );
});

test("moveCard dispatches and enqueues action", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  const movePayload = {
    fromList: "list1",
    toList: "list2",
    cardId: "card1",
    toIndex: 0,
  };

  act(() => {
    result.current.moveCard(movePayload);
  });

  expect(mockEnqueue).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "MOVE_CARD",
      payload: movePayload,
    }),
  );
});

test("undo dispatches action without enqueuing", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.undo();
  });

  // Undo should not enqueue
  expect(mockEnqueue).not.toHaveBeenCalled();
});

test("redo dispatches action without enqueuing", () => {
  const { result } = renderHook(() => useBoardState(), { wrapper });

  act(() => {
    result.current.redo();
  });

  // Redo should not enqueue
  expect(mockEnqueue).not.toHaveBeenCalled();
});
