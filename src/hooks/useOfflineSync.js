import { useEffect, useRef, useState, useCallback } from "react";
import { loadQueue, saveQueue } from "../storage/storage";
import { syncOperation } from "../services/api";

export function useOfflineSync(onConflict) {
  const queueRef = useRef(loadQueue());
  const syncingRef = useRef(false);
  const [, setTick] = useState(0);
  const processQueueRef = useRef(null);

  const processQueue = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    let queue = [...queueRef.current];

    while (queue.length) {
      const op = queue[0];

      try {
        const res = await syncOperation(op);

        if (res.conflict && typeof onConflict === "function") {
          onConflict({
            local: op.localData,
            server: res.serverCard,
            resolve: (keep) => {
              if (keep === "local") {
                setTick((t) => t + 1);
                setTimeout(() => processQueueRef.current(), 0);
              } else if (keep === "server") {
                queue.shift();
                queueRef.current = queue;
                saveQueue(queue);
                setTick((t) => t + 1);
                setTimeout(() => processQueueRef.current(), 0);
              }
            },
          });
          break; // wait for conflict resolution
        }

        queue.shift();
        queueRef.current = queue;
        saveQueue(queue);
      } catch (err) {
        console.error("Sync failed:", err.message);
        break;
      }
    }

    syncingRef.current = false;
  }, [onConflict]);

  // Move ref assignment into useEffect to avoid "cannot update ref during render"
  useEffect(() => {
    processQueueRef.current = processQueue;

    window.addEventListener("online", processQueueRef.current);
    const timer = setInterval(processQueueRef.current, 30_000);

    return () => {
      window.removeEventListener("online", processQueueRef.current);
      clearInterval(timer);
    };
  }, [processQueue]);

  const enqueue = useCallback((operation) => {
    const opWithLocal = {
      ...operation,
      localData: operation.localData ?? operation.payload,
      opId: Date.now() + Math.random(),
    };

    queueRef.current.push(opWithLocal);
    saveQueue(queueRef.current);
    processQueueRef.current();
  }, []);

  const getQueue = useCallback(() => [...queueRef.current], []);

  return { enqueue, getQueue };
}
