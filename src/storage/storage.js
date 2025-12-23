const KEY = "kanban_board_state";
const QUEUE_KEY = "kanban_sync_queue";

export function loadState(initialState) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw);

    return {
      ...initialState,
      ...parsed,
      history: parsed.history ?? [],
      future: parsed.future ?? [],
    };
  } catch {
    return initialState;
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}
