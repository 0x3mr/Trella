import { boardReducer } from "../context/boardReducer";

test("updates card with version bump", () => {
  const state = {
    cards: { a: { id: "a", title: "Old", version: 1 } },
    history: [],
    future: []
  };

  const next = boardReducer(state, {
    type: "UPDATE_CARD",
    id: "a",
    payload: { title: "New" }
  });

  expect(next.cards.a.title).toBe("New");
  expect(next.cards.a.version).toBe(2);
});
