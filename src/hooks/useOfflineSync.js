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
          break;
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

  // Update ref inside useEffect instead of during render
  useEffect(() => {
    processQueueRef.current = processQueue;
  }, [processQueue]);

  useEffect(() => {
    const onlineHandler = () => processQueueRef.current?.();
    const syncHandler = () => processQueueRef.current?.();

    window.addEventListener("online", onlineHandler);
    const timer = setInterval(syncHandler, 30_000);

    return () => {
      window.removeEventListener("online", onlineHandler);
      clearInterval(timer);
    };
  }, []);

  const enqueue = useCallback((operation) => {
    const opWithLocal = {
      ...operation,
      localData: operation.localData ?? operation.payload,
      opId: Date.now() + Math.random(),
    };

    queueRef.current.push(opWithLocal);
    saveQueue(queueRef.current);
    processQueueRef.current?.();
  }, []);

  const getQueue = useCallback(() => [...queueRef.current], []);

  return { enqueue, getQueue };
}
