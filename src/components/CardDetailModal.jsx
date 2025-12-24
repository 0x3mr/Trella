import { useState, useEffect, useRef } from "react";

export default function CardDetailModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    }
  }, [card]);

  // Focus trap
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }

      // Focus trap logic
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!card) return null;

  function handleClose() {
    onSave({ title, description });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white p-4 rounded w-96 space-y-3"
        role="document"
      >
        <h2 id="modal-title" className="sr-only">
          Edit Card
        </h2>
        
        <label htmlFor="card-title" className="sr-only">
          Card title
        </label>
        <input
          id="card-title"
          ref={titleInputRef}
          className="w-full border p-2 rounded"
          data-testid="card-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Card title"
          placeholder="Card title"
        />

        <label htmlFor="card-description" className="sr-only">
          Card description
        </label>
        <textarea
          id="card-description"
          className="w-full border p-2 rounded min-h-[100px]"
          placeholder="Description..."
          data-testid="card-description-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Card description"
        />

        <div className="flex justify-end gap-2">
          <button
            data-testid="card-save-button"
            onClick={handleClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Save card changes"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Cancel and close modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}