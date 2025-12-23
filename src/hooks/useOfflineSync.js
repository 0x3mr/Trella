import { useEffect, useRef, useState } from "react";
import { loadQueue, saveQueue } from "../storage/storage";
import { syncOperation } from "../services/api";

/**
 * useOfflineSync handles:
 * - queuing offline changes
 * - processing them when online
 * - optimistic updates
 * - conflict detection
 */
export function useOfflineSync(onConflict) {
  const queueRef = useRef(loadQueue());
  const syncingRef = useRef(false);
  const [, setTick] = useState(0); // used to trigger rerenders if needed

  async function processQueue() {
    if (syncingRef.current) return;
    syncingRef.current = true;

    let queue = [...queueRef.current];

    while (queue.length) {
      const op = queue[0];

      try {
        const res = await syncOperation(op);

        if (res.conflict) {
          // Notify parent about conflict
          if (typeof onConflict === "function") {
            onConflict({
              local: op.localData,
              server: res.serverCard,
              resolve: (keep) => {
                if (keep === "local") {
                  // Retry keeping local changes
                  queueRef.current = queueRef.current;
                  saveQueue(queueRef.current);
                  processQueue();
                } else if (keep === "server") {
                  // Discard local operation
                  queue.shift();
                  queueRef.current = queue;
                  saveQueue(queue);
                  setTick((t) => t + 1); // trigger rerender
                  processQueue();
                }
              },
            });
          }
          break; // stop processing until user resolves
        }

        // Success: remove operation from queue
        queue.shift();
        queueRef.current = queue;
        saveQueue(queue);
      } catch (err) {
        console.error("Sync failed:", err.message);
        break; // stop retrying for now
      }
    }

    syncingRef.current = false;
  }

  function enqueue(operation) {
    // Attach localData snapshot for potential conflict resolution
    const opWithLocal = {
      ...operation,
      localData: operation.localData ?? operation.payload,
      opId: Date.now() + Math.random(), // unique ID for this operation
    };

    queueRef.current.push(opWithLocal);
    saveQueue(queueRef.current);
    processQueue();
  }

  useEffect(() => {
    window.addEventListener("online", processQueue);

    const timer = setInterval(processQueue, 30_000); // background retry every 30s

    return () => {
      window.removeEventListener("online", processQueue);
      clearInterval(timer);
    };
  }, []);

  return { enqueue, queue: queueRef.current };
}
