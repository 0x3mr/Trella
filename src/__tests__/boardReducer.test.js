/* global describe, it, expect, beforeEach */
import { boardReducer, initialState } from "../context/boardReducer";

describe("boardReducer", () => {
  let state;

  beforeEach(() => {
    state = { ...initialState };
  });

  it("adds a new list", () => {
    const action = { type: "ADD_LIST", payload: "Todo" };
    const newState = boardReducer(state, action);
    expect(newState.lists).toHaveLength(1);
    expect(newState.lists[0].title).toBe("Todo");
    expect(newState.lists[0].cards).toEqual([]);
    expect(newState.history).toHaveLength(1);
  });

  it("renames a list", () => {
    const listState = boardReducer(state, { type: "ADD_LIST", payload: "Old" });
    const listId = listState.lists[0].id;

    const newState = boardReducer(listState, {
      type: "RENAME_LIST",
      payload: { id: listId, title: "New" },
    });

    expect(newState.lists[0].title).toBe("New");
    expect(newState.lists[0].version).toBe(2);
    expect(newState.history).toHaveLength(2);
  });

  it("adds a card", () => {
    const listState = boardReducer(state, {
      type: "ADD_LIST",
      payload: "Todo",
    });
    const listId = listState.lists[0].id;

    const newState = boardReducer(listState, {
      type: "ADD_CARD",
      payload: { listId, title: "Task 1" },
    });

    expect(newState.lists[0].cards).toHaveLength(1);
    expect(newState.lists[0].cards[0].title).toBe("Task 1");
    expect(newState.lists[0].cards[0].version).toBe(1);
  });

  it("updates a card", () => {
    const listState = boardReducer(state, {
      type: "ADD_LIST",
      payload: "Todo",
    });
    const listId = listState.lists[0].id;

    const cardState = boardReducer(listState, {
      type: "ADD_CARD",
      payload: { listId, title: "Task 1" },
    });
    const cardId = cardState.lists[0].cards[0].id;

    const newState = boardReducer(cardState, {
      type: "UPDATE_CARD",
      payload: { listId, cardId, updates: { title: "Updated Task" } },
    });

    expect(newState.lists[0].cards[0].title).toBe("Updated Task");
    expect(newState.lists[0].cards[0].version).toBe(2);
    expect(newState.history).toHaveLength(3);
  });

  it("deletes a card", () => {
    const listState = boardReducer(state, {
      type: "ADD_LIST",
      payload: "Todo",
    });
    const listId = listState.lists[0].id;

    const cardState = boardReducer(listState, {
      type: "ADD_CARD",
      payload: { listId, title: "Task 1" },
    });
    const cardId = cardState.lists[0].cards[0].id;

    const newState = boardReducer(cardState, {
      type: "DELETE_CARD",
      payload: { listId, cardId },
    });

    expect(newState.lists[0].cards).toHaveLength(0);
  });

  it("moves a card within the same list", () => {
    let st = boardReducer(state, { type: "ADD_LIST", payload: "Todo" });
    const listId = st.lists[0].id;

    st = boardReducer(st, {
      type: "ADD_CARD",
      payload: { listId, title: "Task 1" },
    });
    st = boardReducer(st, {
      type: "ADD_CARD",
      payload: { listId, title: "Task 2" },
    });

    const cardId = st.lists[0].cards[0].id;

    const newState = boardReducer(st, {
      type: "MOVE_CARD",
      payload: { fromList: listId, toList: listId, cardId, toIndex: 1 },
    });

    expect(newState.lists[0].cards[1].id).toBe(cardId);
  });

  it("moves a card to a different list", () => {
    let st = boardReducer(state, { type: "ADD_LIST", payload: "Todo" });
    const listA = st.lists[0].id;

    st = boardReducer(st, { type: "ADD_LIST", payload: "Doing" });
    const listB = st.lists[1].id;

    st = boardReducer(st, {
      type: "ADD_CARD",
      payload: { listId: listA, title: "Task 1" },
    });
    const cardId = st.lists[0].cards[0].id;

    const newState = boardReducer(st, {
      type: "MOVE_CARD",
      payload: { fromList: listA, toList: listB, cardId, toIndex: 0 },
    });

    expect(newState.lists[0].cards).toHaveLength(0);
    expect(newState.lists[1].cards).toHaveLength(1);
    expect(newState.lists[1].cards[0].id).toBe(cardId);
  });

  it("archives a list", () => {
    const listState = boardReducer(state, {
      type: "ADD_LIST",
      payload: "Todo",
    });
    const listId = listState.lists[0].id;

    const newState = boardReducer(listState, {
      type: "ARCHIVE_LIST",
      payload: listId,
    });

    expect(newState.lists[0].archived).toBe(true);
  });

  it("undos an action", () => {
    const listState = boardReducer(state, {
      type: "ADD_LIST",
      payload: "Todo",
    });
    const newState = boardReducer(listState, { type: "UNDO" });

    expect(newState.lists).toHaveLength(0);
    expect(newState.history).toHaveLength(0);
    expect(newState.future).toHaveLength(1);
  });

  it("redos an action", () => {
    const listState = boardReducer(state, {
      type: "ADD_LIST",
      payload: "Todo",
    });
    const undone = boardReducer(listState, { type: "UNDO" });
    const redone = boardReducer(undone, { type: "REDO" });

    expect(redone.lists).toHaveLength(1);
    expect(redone.lists[0].title).toBe("Todo");
  });
});
