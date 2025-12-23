// Server-side mock state
let serverState = {
  lists: [],
  cards: [],
};

// Utility: random delay to simulate network latency
function randomDelay() {
  return new Promise((res) => setTimeout(res, 300 + Math.random() * 700));
}

// Utility: randomly fail 15% of requests
function maybeFail() {
  if (Math.random() < 0.15) {
    throw new Error("Server error");
  }
}

/**
 * Main mock server sync function.
 * Supports optimistic updates, conflict detection, versioning.
 * @param {Object} operation - { type, payload, baseVersion }
 * @returns {Object} - { success: true } or { conflict: true, serverCard }
 */
export async function syncOperation(operation) {
  await randomDelay();
  maybeFail();

  const { type, payload, baseVersion } = operation;

  switch (type) {
    case "ADD_LIST":
      serverState.lists.push({
        ...payload,
        id: payload.id,
        cards: [],
        version: 1,
        lastModifiedAt: Date.now(),
        archived: false,
      });
      break;

    case "RENAME_LIST": {
      const list = serverState.lists.find((l) => l.id === payload.id);
      if (list) {
        list.title = payload.title;
        list.version += 1;
        list.lastModifiedAt = Date.now();
      }
      break;
    }

    case "ADD_CARD": {
      const list = serverState.lists.find((l) => l.id === payload.listId);
      if (list) {
        const newCard = {
          ...payload.card,
          version: 1,
          lastModifiedAt: Date.now(),
        };
        list.cards.push(newCard);
        serverState.cards.push(newCard);
      }
      break;
    }

    case "UPDATE_CARD": {
      // Find the card in serverState.cards
      const serverCard = serverState.cards.find((c) => c.id === payload.cardId);
      if (!serverCard) break;

      // Conflict detection: check if server version > baseVersion
      if (serverCard.version > baseVersion) {
        return { conflict: true, serverCard };
      }

      // Apply updates
      Object.assign(serverCard, payload.updates);
      serverCard.version += 1;
      serverCard.lastModifiedAt = Date.now();

      // Also update card in the list
      const list = serverState.lists.find((l) => l.id === payload.listId);
      const cardInList = list?.cards.find((c) => c.id === payload.cardId);
      if (cardInList) Object.assign(cardInList, serverCard);
      break;
    }

    case "DELETE_CARD": {
      const list = serverState.lists.find((l) => l.id === payload.listId);
      if (list) {
        list.cards = list.cards.filter((c) => c.id !== payload.cardId);
      }
      serverState.cards = serverState.cards.filter(
        (c) => c.id !== payload.cardId,
      );
      break;
    }

    case "MOVE_CARD": {
      const { fromList, toList, cardId, toIndex } = payload;

      const source = serverState.lists.find((l) => l.id === fromList);
      const target = serverState.lists.find((l) => l.id === toList);
      if (!source || !target) break;

      const card = source.cards.find((c) => c.id === cardId);
      if (!card) break;

      source.cards = source.cards.filter((c) => c.id !== cardId);
      target.cards.splice(toIndex, 0, card);

      // Update card listId reference
      card.listId = toList;
      card.version += 1;
      card.lastModifiedAt = Date.now();
      break;
    }

    default:
      break;
  }

  return { success: true };
}

/**
 * Returns the full current server state.
 * Useful for debugging or initial load.
 */
export function getServerState() {
  return serverState;
}
