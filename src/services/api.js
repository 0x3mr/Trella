import { setupWorker } from "msw/browser";
import { http, HttpResponse, delay } from "msw";

/**
 * Authoritative mock server state
 * (separate from client reducer state)
 */
let serverState = {
  lists: {},
  cards: {},
};

export const worker = setupWorker(
  http.post("/sync", async ({ request }) => {
    const actions = await request.json();

    // artificial delay to test optimistic UI
    await delay(800);

    actions.forEach((action) => {
      switch (action.type) {
        case "ADD_LIST": {
          const { title } = action.payload;
          const id = crypto.randomUUID();
          serverState.lists[id] = {
            id,
            title,
            cardIds: [],
            version: 1,
            lastModifiedAt: Date.now(),
          };
          break;
        }

        case "ADD_CARD": {
          const { listId, title } = action.payload;
          const id = crypto.randomUUID();
          serverState.cards[id] = {
            id,
            listId,
            title,
            version: 1,
            lastModifiedAt: Date.now(),
          };
          break;
        }

        default:
          break;
      }
    });

    return HttpResponse.json(serverState);
  })
);

/**
 * Client → server sync call
 */
export function syncWithServer(queue) {
  return fetch("/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(queue),
  }).then((res) => {
    if (!res.ok) throw new Error("Sync failed");
    return res.json();
  });
}
