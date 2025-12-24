import { syncOperation, getServerState } from "../services/api";

// Mock Math.random to control random failures
const originalRandom = Math.random;

beforeEach(() => {
  // Reset server state before each test
  const serverState = getServerState();
  serverState.lists = [];
  serverState.cards = [];

  // Mock Math.random to never fail (return > 0.15)
  Math.random = jest.fn(() => 0.5);
});

afterEach(() => {
  Math.random = originalRandom;
});

test("ADD_LIST adds a list to server state", async () => {
  const operation = {
    type: "ADD_LIST",
    payload: { id: "list1", title: "Test List" },
  };

  const result = await syncOperation(operation);

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.lists.length).toBe(1);
  expect(state.lists[0].title).toBe("Test List");
  expect(state.lists[0].id).toBe("list1");
  expect(state.lists[0].version).toBe(1);
});

test("RENAME_LIST updates list title", async () => {
  // Setup: add a list
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "Original Title" },
  });

  // Rename the list
  const result = await syncOperation({
    type: "RENAME_LIST",
    payload: { id: "list1", title: "New Title" },
  });

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.lists[0].title).toBe("New Title");
  expect(state.lists[0].version).toBe(2);
});

test("ADD_CARD adds a card to a list", async () => {
  // Setup: add a list
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "Test List" },
  });

  // Add a card
  const result = await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: {
        id: "card1",
        title: "Test Card",
        description: "Test Description",
      },
    },
  });

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.cards.length).toBe(1);
  expect(state.cards[0].title).toBe("Test Card");
  expect(state.lists[0].cards.length).toBe(1);
});

test("UPDATE_CARD updates a card successfully", async () => {
  // Setup
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "Test List" },
  });

  await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: { id: "card1", title: "Original", description: "" },
    },
  });

  // Update the card
  const result = await syncOperation({
    type: "UPDATE_CARD",
    payload: {
      listId: "list1",
      cardId: "card1",
      updates: { title: "Updated Title" },
    },
    baseVersion: 1,
  });

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.cards[0].title).toBe("Updated Title");
  expect(state.cards[0].version).toBe(2);
});

test("UPDATE_CARD detects conflicts", async () => {
  // Setup
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "Test List" },
  });

  await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: { id: "card1", title: "Original", description: "" },
    },
  });

  // Update card (version becomes 2)
  await syncOperation({
    type: "UPDATE_CARD",
    payload: {
      listId: "list1",
      cardId: "card1",
      updates: { title: "First Update" },
    },
    baseVersion: 1,
  });

  // Try to update with old baseVersion (should conflict)
  const result = await syncOperation({
    type: "UPDATE_CARD",
    payload: {
      listId: "list1",
      cardId: "card1",
      updates: { title: "Conflicting Update" },
    },
    baseVersion: 1,
  });

  expect(result.conflict).toBe(true);
  expect(result.serverCard).toBeDefined();
  expect(result.serverCard.title).toBe("First Update");
});

test("DELETE_CARD removes a card", async () => {
  // Setup
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "Test List" },
  });

  await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: { id: "card1", title: "Test Card", description: "" },
    },
  });

  // Delete the card
  const result = await syncOperation({
    type: "DELETE_CARD",
    payload: { listId: "list1", cardId: "card1" },
  });

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.cards.length).toBe(0);
  expect(state.lists[0].cards.length).toBe(0);
});

test("MOVE_CARD moves card within same list", async () => {
  // Setup
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "Test List" },
  });

  await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: { id: "card1", title: "Card 1", description: "" },
    },
  });

  await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: { id: "card2", title: "Card 2", description: "" },
    },
  });

  // Move card1 to position 1
  const result = await syncOperation({
    type: "MOVE_CARD",
    payload: {
      fromList: "list1",
      toList: "list1",
      cardId: "card1",
      toIndex: 1,
    },
  });

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.lists[0].cards[1].id).toBe("card1");
});

test("MOVE_CARD moves card between lists", async () => {
  // Setup two lists
  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list1", title: "List 1" },
  });

  await syncOperation({
    type: "ADD_LIST",
    payload: { id: "list2", title: "List 2" },
  });

  await syncOperation({
    type: "ADD_CARD",
    payload: {
      listId: "list1",
      card: { id: "card1", title: "Card 1", description: "" },
    },
  });

  // Move card from list1 to list2
  const result = await syncOperation({
    type: "MOVE_CARD",
    payload: {
      fromList: "list1",
      toList: "list2",
      cardId: "card1",
      toIndex: 0,
    },
  });

  expect(result.success).toBe(true);
  const state = getServerState();
  expect(state.lists[0].cards.length).toBe(0);
  expect(state.lists[1].cards.length).toBe(1);
  expect(state.lists[1].cards[0].id).toBe("card1");
  expect(state.lists[1].cards[0].listId).toBe("list2");
});

test("getServerState returns current state", () => {
  const state = getServerState();
  expect(state).toHaveProperty("lists");
  expect(state).toHaveProperty("cards");
  expect(Array.isArray(state.lists)).toBe(true);
  expect(Array.isArray(state.cards)).toBe(true);
});
