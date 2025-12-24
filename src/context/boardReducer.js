import { v4 as uuid } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

export const initialState = {
  lists: [],
  history: [],
  future: [],
};

// Helper to strip history/future from state before storing
function stripHistory(state) {
  const { history, future, ...rest } = state;
  return rest;
}

// Helper to add to history without including nested history
function pushHistory(prev, next) {
  const MAX_HISTORY = 20; // Limit history size
  
  const newHistory = [
    ...prev.history,
    stripHistory(prev)
  ].slice(-MAX_HISTORY); // Keep only last 20 entries
  
  return {
    ...next,
    history: newHistory,
    future: [],
  };
}

export function boardReducer(state, action) {
  switch (action.type) {
    case "ADD_LIST": {
      const newState = {
        ...state,
        lists: [
          ...state.lists,
          {
            id: uuid(),
            title: action.payload,
            cards: [],
            archived: false,
            version: 1,
            lastModifiedAt: Date.now(),
          },
        ],
      };
      return pushHistory(state, newState);
    }

    case "RENAME_LIST": {
      const newState = {
        ...state,
        lists: state.lists.map((l) =>
          l.id === action.payload.id
            ? {
                ...l,
                title: action.payload.title,
                version: l.version + 1,
                lastModifiedAt: Date.now(),
              }
            : l,
        ),
      };
      return pushHistory(state, newState);
    }

    case "ADD_CARD": {
      const newState = {
        ...state,
        lists: state.lists.map((l) =>
          l.id === action.payload.listId
            ? {
                ...l,
                cards: [
                  ...l.cards,
                  {
                    id: uuid(),
                    title: action.payload.title,
                    description: "",
                    tags: [],
                    version: 1,
                    lastModifiedAt: Date.now(),
                  },
                ],
              }
            : l,
        ),
      };
      return pushHistory(state, newState);
    }

    case "UPDATE_CARD": {
      const { cardId, listId, updates } = action.payload;

      const newState = {
        ...state,
        lists: state.lists.map((l) =>
          l.id === listId
            ? {
                ...l,
                cards: l.cards.map((c) =>
                  c.id === cardId
                    ? {
                        ...c,
                        ...updates,
                        version: c.version + 1,
                        lastModifiedAt: Date.now(),
                      }
                    : c,
                ),
              }
            : l,
        ),
      };
      return pushHistory(state, newState);
    }

    case "DELETE_CARD": {
      const { cardId, listId } = action.payload;

      const newState = {
        ...state,
        lists: state.lists.map((l) =>
          l.id === listId
            ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
            : l,
        ),
      };
      return pushHistory(state, newState);
    }

    case "MOVE_CARD": {
      const { fromList, toList, cardId, toIndex } = action.payload;
      const sourceList = state.lists.find((l) => l.id === fromList);
      if (!sourceList) return state;

      const fromIndex = sourceList.cards.findIndex((c) => c.id === cardId);
      if (fromIndex === -1) return state;

      // SAME LIST REORDER
      if (fromList === toList) {
        if (fromIndex === toIndex) return state;

        const newLists = state.lists.map((l) =>
          l.id !== fromList
            ? l
            : { ...l, cards: arrayMove(l.cards, fromIndex, toIndex) },
        );

        return pushHistory(state, { ...state, lists: newLists });
      }

      // CROSS LIST MOVE
      const card = sourceList.cards[fromIndex];

      const newLists = state.lists.map((l) => {
        if (l.id === fromList) {
          return { ...l, cards: l.cards.filter((c) => c.id !== cardId) };
        }
        if (l.id === toList) {
          const cards = [...l.cards];
          cards.splice(toIndex, 0, card);
          return { ...l, cards };
        }
        return l;
      });

      return pushHistory(state, { ...state, lists: newLists });
    }

    case "ARCHIVE_LIST": {
      const newState = {
        ...state,
        lists: state.lists.map((l) =>
          l.id === action.payload ? { ...l, archived: true } : l,
        ),
      };
      return pushHistory(state, newState);
    }

    case "UNDO": {
      if (!state.history.length) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...prev,
        history: state.history.slice(0, -1),
        future: [stripHistory(state), ...state.future].slice(0, 20), // Limit future too
      };
    }

    case "REDO": {
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        ...next,
        history: [...state.history, stripHistory(state)].slice(-20), // Limit history
        future: state.future.slice(1),
      };
    }

    default:
      return state;
  }
}