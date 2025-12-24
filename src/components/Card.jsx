import React, { useState, useCallback, Suspense } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBoardState } from "../hooks/useBoardState";

// Lazy-load heavy components
const CardDetailModal = React.lazy(() => import("./CardDetailModal"));
const ConfirmDialog = React.lazy(() => import("./ConfirmDialog"));

function Card({ card, listId }) {
  const { updateCard, deleteCard } = useBoardState();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `${listId}:${card.id}`,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const save = useCallback(
    (updates) => updateCard(listId, card.id, updates),
    [listId, card.id, updateCard],
  );

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-100 rounded p-2 flex gap-2"
        role="article"
        aria-label={`Card: ${card.title}`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab select-none text-gray-400"
          title="Drag to move card"
          aria-label={`Drag handle for ${card.title}`}
          role="button"
          tabIndex={0}
        >
          ☰
        </div>

        {/* Clickable Content */}
        <div
          className="flex-1 cursor-pointer"
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`Open details for ${card.title}`}
        >
          <div className="font-medium">{card.title}</div>

          {card.description && (
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
              {card.description}
            </div>
          )}
        </div>
      </div>

      {/* Lazy-loaded Modal */}
      <Suspense
        fallback={
          open && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/40 text-white"
              role="alert"
              aria-live="polite"
            >
              Loading card details...
            </div>
          )
        }
      >
        {open && (
          <CardDetailModal
            card={card}
            onClose={() => setOpen(false)}
            onSave={save}
          />
        )}
      </Suspense>

      {/* Lazy-loaded Confirm Dialog */}
      <Suspense
        fallback={
          confirm && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/40 text-white"
              role="alert"
              aria-live="polite"
            >
              Loading confirmation...
            </div>
          )
        }
      >
        {confirm && (
          <ConfirmDialog
            open={confirm}
            onCancel={() => setConfirm(false)}
            onConfirm={() => deleteCard(listId, card.id)}
          />
        )}
      </Suspense>
    </>
  );
}

export default React.memo(Card);
