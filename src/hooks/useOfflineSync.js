import { useEffect } from "react";
import { syncWithServer } from "../services/api";

export function useOfflineSync(state, dispatch) {
  useEffect(() => {
    function onOnline() {
      if (state.offline.syncQueue.length === 0) return;

      syncWithServer(state.offline.syncQueue)
        .then(() => dispatch({ type: "CLEAR_QUEUE" }))
        .catch(() => console.warn("Sync failed"));
    }

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [state, dispatch]);
}
