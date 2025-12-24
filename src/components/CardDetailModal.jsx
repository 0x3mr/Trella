import { useState, useEffect } from "react";

export default function CardDetailModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    }
  }, [card]);

  if (!card) return null;

  function handleClose() {
    onSave({ title, description });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-96 space-y-3">
        <input
          className="w-full border p-2 rounded"
          data-testid="card-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded min-h-[100px]"
          placeholder="Description..."
          data-testid="card-description-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button data-testid="card-save-button" onClick={handleClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
