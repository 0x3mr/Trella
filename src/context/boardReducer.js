import { v4 as uuid } from "uuid";

export const ActionTypes = {
  ADD_LIST: "ADD_LIST",
  RENAME_LIST: "RENAME_LIST",
  ARCHIVE_LIST: "ARCHIVE_LIST",

  ADD_CARD: "ADD_CARD",
  UPDATE_CARD: "UPDATE_CARD",
  DELETE_CARD: "DELETE_CARD",
  MOVE_CARD: "MOVE_CARD",

  UNDO: "UNDO",
  REDO: "REDO",
};

export const initialState = {
  board: {
    lists: {},       // { [listId]: { id, title, cardIds: [], version, lastModifiedAt } }
    cards: {},       // { [cardId]: { id, listId, title, description, tags, version, lastModifiedAt } }
    listOrder: [],
  },

  history: {
    past: [],
    future: [],
  },
};

function withHistory(state, newBoard) {
  return {
    ...state,
    board: newBoard,
    history: {
      past: [...state.history.past, state.board],
      future: [],
    },
  };
}

export function boardReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_LIST: {
      const id = uuid();
      const newBoard = {
        ...state.board,
        lists: {
          ...state.board.lists,
          [id]: { id, title: action.payload.title, cardIds: [], version: 1, lastModifiedAt: Date.now() },
        },
        listOrder: [...state.board.listOrder, id],
      };
      return withHistory(state, newBoard);
    }

case ActionTypes.ADD_CARD: {
  const { listId, title } = action.payload;
  const id = uuid(); // always new
  const newCard = {
    id,
    listId,
    title,
    description: "",
    tags: [],
    version: 1,
    lastModifiedAt: Date.now(),
  };

  const newBoard = {
    ...state.board,
    cards: { ...state.board.cards, [id]: newCard },
    lists: {
      ...state.board.lists,
      [listId]: {
        ...state.board.lists[listId],
        cardIds: [...state.board.lists[listId].cardIds, id],
      },
    },
  };

  return withHistory(state, newBoard);
}


case ActionTypes.MOVE_CARD: {
  const { cardId, fromListId, toListId, fromIndex, toIndex } = action.payload;

  const fromCardIds = [...state.board.lists[fromListId].cardIds];

  if (fromIndex < 0 || fromIndex >= fromCardIds.length) {
    // fallback: find the actual index if fromIndex is wrong
    const actualIndex = fromCardIds.indexOf(cardId);
    if (actualIndex !== -1) fromCardIds.splice(actualIndex, 1);
  } else {
    fromCardIds.splice(fromIndex, 1);
  }

  const toCardIds = [...state.board.lists[toListId].cardIds];
  toCardIds.splice(toIndex, 0, cardId);

  const newBoard = {
    ...state.board,
    lists: {
      ...state.board.lists,
      [fromListId]: { ...state.board.lists[fromListId], cardIds: fromCardIds },
      [toListId]: { ...state.board.lists[toListId], cardIds: toCardIds },
    },
    cards: {
      ...state.board.cards,
      [cardId]: {
        ...state.board.cards[cardId],
        listId: toListId,
        version: state.board.cards[cardId].version + 1,
        lastModifiedAt: Date.now(),
      },
    },
  };

  return withHistory(state, newBoard);
}


    case ActionTypes.UNDO: {
      const previous = state.history.past.at(-1);
      if (!previous) return state;
      return {
        ...state,
        board: previous,
        history: {
          past: state.history.past.slice(0, -1),
          future: [state.board, ...state.history.future],
        },
      };
    }

    case ActionTypes.REDO: {
      const next = state.history.future[0];
      if (!next) return state;
      return {
        ...state,
        board: next,
        history: {
          past: [...state.history.past, state.board],
          future: state.history.future.slice(1),
        },
      };
    }

    default:
      return state;
  }
}
