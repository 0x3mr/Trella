// src/storage/storage.js
const KEY = "kanban_board_state";
const QUEUE_KEY = "kanban_sync_queue";
const MAX_QUEUE_SIZE = 50; // max operations to store
const MAX_HISTORY_SIZE = 20; // reduced from 50 to save space

/**
 * Load the saved board state from localStorage.
 * Returns `initialState` if nothing is saved or parsing fails.
 */
export function loadState(initialState) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return {
      ...initialState,
      lists: parsed.lists ?? initialState.lists,
      // Don't restore history/future to avoid quota issues
      history: [],
      future: [],
    };
  } catch (err) {
    console.warn("Failed to load state:", err);
    return initialState;
  }
}

/**
 * Save the current board state to localStorage.
 * Only saves lists, NOT history/future to avoid quota issues.
 */
export function saveState(state) {
  try {
    // Only save the essential data, exclude history and future
    const minimalState = {
      lists: state.lists ?? [],
    };
    
    const serialized = JSON.stringify(minimalState);
    
    // Check if we're approaching quota limits (5MB typical)
    if (serialized.length > 4 * 1024 * 1024) { // 4MB warning threshold
      console.warn("State is getting large, consider data cleanup");
      
      // Emergency cleanup: keep only non-archived lists with limited cards
      const cleanedState = {
        lists: (state.lists ?? [])
          .filter(l => !l.archived)
          .map(l => ({
            ...l,
            cards: l.cards.slice(-100), // Keep only last 100 cards per list
          }))
      };
      
      localStorage.setItem(KEY, JSON.stringify(cleanedState));
      return;
    }
    
    localStorage.setItem(KEY, serialized);
  } catch (err) {
    console.error("Failed to save state:", err);
    
    // If quota exceeded, try emergency cleanup
    if (err.name === "QuotaExceededError" || err.message.includes("quota")) {
      try {
        const emergencyState = {
          lists: (state.lists ?? [])
            .filter(l => !l.archived)
            .slice(-10) // Keep only last 10 lists
            .map(l => ({
              ...l,
              cards: l.cards.slice(-20), // Keep only last 20 cards per list
            }))
        };
        localStorage.setItem(KEY, JSON.stringify(emergencyState));
        console.warn("Emergency cleanup performed - some data may be lost");
      } catch (cleanupErr) {
        console.error("Emergency cleanup failed:", cleanupErr);
        // Last resort: clear everything
        localStorage.removeItem(KEY);
      }
    }
  }
}

/**
 * Load the sync queue from localStorage.
 * Returns empty array if nothing is saved or parsing fails.
 */
export function loadQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const queue = JSON.parse(raw);
    return Array.isArray(queue) ? queue.slice(-MAX_QUEUE_SIZE) : [];
  } catch (err) {
    console.warn("Failed to load queue:", err);
    return [];
  }
}

/**
 * Save the sync queue to localStorage.
 * Keeps only the last `MAX_QUEUE_SIZE` operations.
 */
export function saveQueue(queue) {
  try {
    const trimmedQueue = Array.isArray(queue)
      ? queue.slice(-MAX_QUEUE_SIZE)
      : [];
    localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmedQueue));
  } catch (err) {
    console.warn("Failed to save queue:", err);
    
    // If quota exceeded, clear old queue
    if (err.name === "QuotaExceededError" || err.message.includes("quota")) {
      try {
        localStorage.removeItem(QUEUE_KEY);
        // Try saving just the last few operations
        const minimalQueue = trimmedQueue.slice(-10);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(minimalQueue));
      } catch {
        // Ignore if this also fails
      }
    }
  }
}

/**
 * Optional: Clear both state and queue. Useful for tests or dev.
 */
export function clearStorage() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(QUEUE_KEY);
  } catch {
    // ignore errors
  }
}

/**
 * Get storage usage info for debugging
 */
export function getStorageInfo() {
  try {
    const stateSize = localStorage.getItem(KEY)?.length || 0;
    const queueSize = localStorage.getItem(QUEUE_KEY)?.length || 0;
    const totalSize = stateSize + queueSize;
    
    return {
      stateSize,
      queueSize,
      totalSize,
      stateSizeKB: (stateSize / 1024).toFixed(2),
      queueSizeKB: (queueSize / 1024).toFixed(2),
      totalSizeKB: (totalSize / 1024).toFixed(2),
    };
  } catch {
    return null;
  }
}